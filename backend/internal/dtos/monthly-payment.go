package dtos

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

// MonthlyPaymentResponseDTO é usado para retornar dados ao frontend.
type MonthlyPaymentResponseDTO struct {
	ID            uuid.UUID           `json:"id"`
	UserID        uuid.UUID           `json:"user_id"`
	Month         int                 `json:"month"`
	Year          int                 `json:"year"`
	Amount        float64             `json:"amount"` // em reais
	PaymentStatus types.PaymentStatus `json:"status"`
	DueDate       time.Time           `json:"due_date"`
	PaymentURL    *string             `json:"payment_url,omitempty"`
	PixQRCode     *string             `json:"pix_qr_code,omitempty"`
	PaidAt        *time.Time          `json:"paid_at,omitempty"`
}

func ToMonthlyPaymentResponse(p entities.MonthlyPayment) MonthlyPaymentResponseDTO {
	return MonthlyPaymentResponseDTO{
		ID:            p.ID,
		UserID:        p.UserID,
		Month:         p.Month,
		Year:          p.Year,
		Amount:        float64(p.AmountDue) / 100.0,
		PaymentStatus: p.PaymentStatus,
		DueDate:       p.DueDate,
		PaymentURL:    p.PaymentURL,
		PixQRCode:     p.PixQRCode,
		PaidAt:        p.PaidAt,
	}
}

func ToMonthlyPaymentListResponse(payments []entities.MonthlyPayment) []MonthlyPaymentResponseDTO {
	list := make([]MonthlyPaymentResponseDTO, len(payments))
	for i, p := range payments {
		list[i] = ToMonthlyPaymentResponse(p)
	}
	return list
}

// MonthlyPaymentRequestDTO para criação manual (se necessário)
type MonthlyPaymentRequestDTO struct {
	UserID  uuid.UUID `json:"user_id" binding:"required"`
	Month   int       `json:"month" binding:"required,min=1,max=12"`
	Year    int       `json:"year" binding:"required"`
	Amount  float64   `json:"amount" binding:"required,gt=0"` // em reais
	DueDate time.Time `json:"due_date" binding:"required"`
}

func (dto *MonthlyPaymentRequestDTO) ToEntity() *entities.MonthlyPayment {
	return &entities.MonthlyPayment{
		ID:            uuid.New(),
		UserID:        dto.UserID,
		Month:         dto.Month,
		Year:          dto.Year,
		AmountDue:     int64(dto.Amount * 100), // converte para centavos
		PaymentStatus: types.PaymentDraft,
		DueDate:       dto.DueDate,
	}
}
