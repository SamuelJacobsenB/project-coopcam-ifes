package bus_reservation

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusReservation struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;index" json:"user_id"`

	Date     time.Time    `json:"date"`
	Period   types.Period `gorm:"type:text" json:"period"`
	Attended *bool        `json:"attended"`

	WeeklyPreferenceID *uuid.UUID `gorm:"type:uuid" json:"weekly_preference_id"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
