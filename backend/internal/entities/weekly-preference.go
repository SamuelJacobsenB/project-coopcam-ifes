package entities

import (
	"time"

	"github.com/google/uuid"
)

type WeeklyPreference struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;index" json:"user_id"`
	TemplateID uuid.UUID `gorm:"type:uuid" json:"template_id"`

	WeekStart time.Time        `json:"week_start"`
	Overrides []BusReservation `gorm:"foreignKey:WeeklyPreferenceID" json:"overrides"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (WeeklyPreference) TableName() string {
	return "weekly_preferences"
}
