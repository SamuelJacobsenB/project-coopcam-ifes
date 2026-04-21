package monthly_payment

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/payment"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyPaymentService struct {
	repo     *MonthlyPaymentRepository
	mpClient *payment.MercadoPagoClient
}

func NewMonthlyPaymentService(repo *MonthlyPaymentRepository) *MonthlyPaymentService {
	return &MonthlyPaymentService{
		repo:     repo,
		mpClient: payment.NewMercadoPagoClient(),
	}
}

// FindByUser retorna todos os pagamentos de um usuário, ordenados do mais recente para o mais antigo.
func (s *MonthlyPaymentService) FindByUser(userID uuid.UUID) ([]entities.MonthlyPayment, error) {
	return s.repo.FindByUserID(userID)
}

func (s *MonthlyPaymentService) ListByPeriodLight(month, year int) ([]entities.MonthlyPayment, error) {
	return s.repo.ListByPeriodLight(month, year)
}

// UpdateStatus permite alterar manualmente o status de um pagamento (ex: marcar como pago manualmente).
func (s *MonthlyPaymentService) UpdateStatus(id uuid.UUID, status types.PaymentStatus) error {
	payment, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	payment.PaymentStatus = status
	if status == types.PaymentPaid {
		now := time.Now()
		payment.PaidAt = &now
	}
	return s.repo.Update(payment)
}

func (s *MonthlyPaymentService) EmitBatch(ctx context.Context, month, year int) error {
	drafts, err := s.repo.FindDraftsByPeriod(month, year)
	if err != nil {
		return fmt.Errorf("erro ao buscar rascunhos: %w", err)
	}

	if len(drafts) == 0 {
		return errors.New("não existem pagamentos em rascunho para emitir neste período")
	}

	for _, p := range drafts {
		if p.ExternalID != nil {
			continue
		}

		// Chama o cliente do Mercado Pago para criar o pagamento PIX
		// Passamos o ID interno como external_reference para conciliação posterior
		mpRes, err := s.mpClient.CreatePixPayment(
			ctx,
			p.AmountDue,
			p.User.Email,
			p.ID.String(),
			p.DueDate,
		)

		if err != nil {
			fmt.Printf("Falha ao emitir PIX para usuário %s: %v\n", p.UserID, err)
			continue
		}

		externalID := fmt.Sprintf("%d", mpRes.ID)
		p.ExternalID = &externalID
		p.PaymentStatus = types.PaymentPending // Deixa de ser rascunho e passa a aguardar pagamento

		// URLs e QR Codes vindos do MP
		p.PaymentURL = &mpRes.PointOfInteraction.TransactionData.TicketURL
		p.PixQRCode = &mpRes.PointOfInteraction.TransactionData.QRCode

		if err := s.repo.Update(&p); err != nil {
			fmt.Printf("Falha ao salvar no banco o pagamento %d (User: %s): %v\n", mpRes.ID, p.UserID, err)
		}
	}

	return nil
}

func (s *MonthlyPaymentService) ProcessWebhook(ctx context.Context, externalID string) error {
	payment, err := s.repo.FindByExternalID(externalID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	// Se já estiver pago, não processa novamente para evitar Race Conditions
	if payment.PaymentStatus == types.PaymentPaid {
		return nil
	}

	mpPayment, err := s.mpClient.GetPayment(ctx, externalID)
	if err != nil {
		return err
	}

	newStatus := s.mapMPStatusToInternal(mpPayment.Status)

	if payment.PaymentStatus != newStatus {
		var paidAt *time.Time
		if newStatus == types.PaymentPaid {
			now := time.Now()
			paidAt = &now
		}

		return s.repo.UpdateStatus(payment.ID, newStatus, paidAt)
	}
	return nil
}

// converte o status devolvido pelo Mercado Pago.
func (s *MonthlyPaymentService) mapMPStatusToInternal(mpStatus string) types.PaymentStatus {
	switch mpStatus {
	case "approved":
		return types.PaymentPaid
	case "pending":
		return types.PaymentPending
	case "rejected":
		return types.PaymentFailed
	case "cancelled":
		return types.PaymentCanceled
	case "refunded":
		return types.PaymentRefunded
	default:
		// Manter o atual.
		return types.PaymentPending
	}
}
