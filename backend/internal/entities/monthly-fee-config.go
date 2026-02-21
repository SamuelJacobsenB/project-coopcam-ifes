package entities

import (
	"time"

	"github.com/google/uuid"
)

type MonthlyFeeConfig struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`

	Month int `gorm:"index:idx_month_year,unique;not null" json:"month"`
	Year  int `gorm:"index:idx_month_year,unique;not null" json:"year"`

	// Valores salvos em centavos (ex: R$ 50,00 = 5000) para evitar problemas de precisão.
	BaseAmount         int64 `gorm:"not null" json:"base_amount"`
	FinancialAidAmount int64 `gorm:"not null" json:"financial_aid_amount"`

	// Data limite para o pagamento neste mês
	DueDate time.Time `gorm:"not null" json:"due_date"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (MonthlyFeeConfig) TableName() string {
	return "monthly_fee_configs"
}
