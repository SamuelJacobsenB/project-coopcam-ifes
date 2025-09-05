package entities

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type User struct {
	ID                 uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	TemplateID         uuid.UUID `gorm:"type:uuid" json:"template_id"`
	WeeklyPreferenceID uuid.UUID `gorm:"type:uuid" json:"weekly_preference_id"`

	Name     string       `gorm:"uniqueIndex;not null" json:"name"`
	Email    string       `gorm:"uniqueIndex;not null" json:"email"`
	Password string       `json:"password"`
	Roles    []types.Role `gorm:"type:text[]" json:"roles"`

	CPF       string    `json:"cpf"`
	Phone     string    `json:"phone"`
	Adress    string    `json:"adress"`
	CEP       string    `json:"cep"`
	Birth     time.Time `json:"birth"`
	AvatarURL string    `json:"avatar_url"`

	Template         *Template         `gorm:"foreignKey:TemplateID" json:"template"`
	WeeklyPreference *WeeklyPreference `gorm:"foreignKey:WeeklyPreferenceID" json:"weekly_preference"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
