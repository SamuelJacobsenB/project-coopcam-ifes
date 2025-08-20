package weekly_preference

import (
	"time"

	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/bus-reservation"
	"github.com/google/uuid"
)

type WeeklyPreference struct {
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID     uuid.UUID `gorm:"type:uuid;index"`
	TemplateID uuid.UUID `gorm:"type:uuid"`
	WeekStart  time.Time
	Overrides  []bus_reservation.BusReservation `gorm:"foreignKey:WeeklyPreferenceID"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
