package entities

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID                 uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	TemplateID         *uuid.UUID `gorm:"type:uuid" json:"template_id"`
	WeeklyPreferenceID *uuid.UUID `gorm:"type:uuid" json:"weekly_preference_id"`

	Name     string `gorm:"uniqueIndex;not null" json:"name"`
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Password string `json:"-"`
	Role     string `gorm:"type:text;default:'user'" json:"role"`

	CPF     string    `json:"cpf"`
	Phone   string    `json:"phone"`
	Address string    `json:"address"`
	CEP     string    `json:"cep"`
	Birth   time.Time `json:"birth"`

	HasFinancialAid bool `gorm:"default:false" json:"has_financial_aid"`

	Template         *Template         `gorm:"foreignKey:TemplateID" json:"template"`
	WeeklyPreference *WeeklyPreference `gorm:"foreignKey:WeeklyPreferenceID" json:"weekly_preference"`
	Payments         []MonthlyPayment  `gorm:"foreignKey:UserID" json:"payments,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
