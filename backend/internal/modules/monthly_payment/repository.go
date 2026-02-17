package monthly_payment

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyPaymentRepository struct {
	db *gorm.DB
}

func NewMonthlyPaymentRepository(db *gorm.DB) *MonthlyPaymentRepository {
	return &MonthlyPaymentRepository{db}
}

// Criar uma nova cobrança
func (repo *MonthlyPaymentRepository) Create(payment *entities.MonthlyPayment) error {
	return repo.db.Create(payment).Error
}

// Buscar pagamentos de um usuário específico
func (repo *MonthlyPaymentRepository) FindByUserID(userID uuid.UUID) ([]entities.MonthlyPayment, error) {
	var payments []entities.MonthlyPayment
	// Ordena do mais recente para o mais antigo
	err := repo.db.Where("user_id = ?", userID).Order("year desc, month desc").Find(&payments).Error
	return payments, err
}

// Buscar um pagamento específico (para atualizar status, por exemplo)
func (repo *MonthlyPaymentRepository) FindByID(id uuid.UUID) (*entities.MonthlyPayment, error) {
	var payment entities.MonthlyPayment
	err := repo.db.Where("id = ?", id).First(&payment).Error
	return &payment, err
}

// FindByPeriod Verificar se existe pagamento para aquele Mês/Ano/User (Evitar duplicidade manual)
func (repo *MonthlyPaymentRepository) FindByPeriod(userID uuid.UUID, month, year int) (*entities.MonthlyPayment, error) {
	var payment entities.MonthlyPayment
	err := repo.db.Where("user_id = ? AND month = ? AND year = ?", userID, month, year).First(&payment).Error
	return &payment, err
}

// Atualizar status de pagamento
func (repo *MonthlyPaymentRepository) MarkAsPaid(id uuid.UUID) error {
	now := time.Now()
	return repo.db.Model(&entities.MonthlyPayment{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_paid": true,
			"paid_at": now,
		}).Error
}

// Marcar como não pago (caso tenha sido erro)
func (repo *MonthlyPaymentRepository) MarkAsUnpaid(id uuid.UUID) error {
	return repo.db.Model(&entities.MonthlyPayment{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_paid": false,
			"paid_at": nil,
		}).Error
}
