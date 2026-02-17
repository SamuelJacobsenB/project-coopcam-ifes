package monthly_payment

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyPaymentService struct {
	repo *MonthlyPaymentRepository
}

func NewMonthlyPaymentService(repo *MonthlyPaymentRepository) *MonthlyPaymentService {
	return &MonthlyPaymentService{repo}
}

func (service *MonthlyPaymentService) Create(payment *entities.MonthlyPayment) error {
	// Verifica se já existe cobrança para este mês/ano
	existing, err := service.repo.FindByPeriod(payment.UserID, payment.Month, payment.Year)
	if err == nil && existing != nil {
		return errors.New("já existe uma cobrança para este usuário neste período")
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err // Erro de banco real
	}

	return service.repo.Create(payment)
}

func (service *MonthlyPaymentService) FindByUserID(userID uuid.UUID) ([]entities.MonthlyPayment, error) {
	return service.repo.FindByUserID(userID)
}

func (service *MonthlyPaymentService) FindByID(id uuid.UUID) (*entities.MonthlyPayment, error) {
	return service.repo.FindByID(id)
}

func (service *MonthlyPaymentService) TogglePaymentStatus(id uuid.UUID, isPaid bool) error {
	if isPaid {
		return service.repo.MarkAsPaid(id)
	}
	return service.repo.MarkAsUnpaid(id)
}
