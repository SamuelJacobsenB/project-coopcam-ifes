package monthly_payment

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyPaymentRepository struct {
	db *gorm.DB
}

func NewMonthlyPaymentRepository(db *gorm.DB) *MonthlyPaymentRepository {
	return &MonthlyPaymentRepository{db}
}

func (r *MonthlyPaymentRepository) FindByID(id uuid.UUID) (*entities.MonthlyPayment, error) {
	var p entities.MonthlyPayment
	err := r.db.Preload("User").First(&p, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *MonthlyPaymentRepository) FindByUserID(userID uuid.UUID) ([]entities.MonthlyPayment, error) {
	var payments []entities.MonthlyPayment
	err := r.db.Where("user_id = ?", userID).Order("year desc, month desc").Find(&payments).Error
	return payments, err
}

func (r *MonthlyPaymentRepository) FindByPeriod(userID uuid.UUID, month, year int) (*entities.MonthlyPayment, error) {
	var p entities.MonthlyPayment
	err := r.db.Where("user_id = ? AND month = ? AND year = ?", userID, month, year).First(&p).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// FindByExternalID busca pelo external_id (usado no webhook)
func (r *MonthlyPaymentRepository) FindByExternalID(extID string) (*entities.MonthlyPayment, error) {
	var p entities.MonthlyPayment
	err := r.db.Preload("User").First(&p, "external_id = ?", extID).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *MonthlyPaymentRepository) FindDraftsByPeriod(month, year int) ([]entities.MonthlyPayment, error) {
	var payments []entities.MonthlyPayment
	err := r.db.
		Preload("User").
		Where("month = ? AND year = ? AND payment_status = ? AND external_id IS NULL", month, year, types.PaymentDraft).
		Find(&payments).Error
	return payments, err
}

func (r *MonthlyPaymentRepository) ListByPeriod(month, year int) ([]entities.MonthlyPayment, error) {
	var payments []entities.MonthlyPayment
	err := r.db.Preload("User").
		Where("month = ? AND year = ?", month, year).
		Find(&payments).Error
	return payments, err
}

func (r *MonthlyPaymentRepository) ListByPeriodLight(month, year int) ([]entities.MonthlyPayment, error) {
	var payments []entities.MonthlyPayment
	err := r.db.Where("month = ? AND year = ?", month, year).
		Find(&payments).Error
	return payments, err
}

func (r *MonthlyPaymentRepository) ExistsForPeriod(month, year int) (bool, error) {
	var count int64
	err := r.db.Model(&entities.MonthlyPayment{}).
		Where("month = ? AND year = ?", month, year).
		Count(&count).Error
	return count > 0, err
}

func (r *MonthlyPaymentRepository) Create(p *entities.MonthlyPayment) error {
	return r.db.Create(p).Error
}

func (r *MonthlyPaymentRepository) CreateMany(payments []entities.MonthlyPayment) error {
	return r.db.CreateInBatches(payments, 100).Error
}

func (r *MonthlyPaymentRepository) UpdateStatus(id uuid.UUID, status types.PaymentStatus, paidAt *time.Time) error {
	updates := map[string]interface{}{
		"payment_status": status,
	}
	if paidAt != nil {
		updates["paid_at"] = paidAt
	}

	return r.db.Model(&entities.MonthlyPayment{}).Where("id = ?", id).Updates(updates).Error
}

func (r *MonthlyPaymentRepository) Update(p *entities.MonthlyPayment) error {
	return r.db.Save(p).Error
}
