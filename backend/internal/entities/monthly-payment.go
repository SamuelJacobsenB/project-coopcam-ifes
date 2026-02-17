package entities

import (
	"time"

	"github.com/google/uuid"
)

type MonthlyPayment struct {
	ID     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;index:idx_user_month_year,unique;not null" json:"user_id"`

	Month int `gorm:"index:idx_user_month_year,unique;not null" json:"month"`
	Year  int `gorm:"index:idx_user_month_year,unique;not null" json:"year"`

	IsPaid bool       `gorm:"default:false" json:"is_paid"`
	PaidAt *time.Time `json:"paid_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (MonthlyPayment) TableName() string {
	return "monthly_payments"
}
