package bus_reservation

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusReservation struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;index"`
	Date      time.Time
	Period    types.Period
	Attended  *bool
	CreatedAt time.Time
	UpdatedAt time.Time
}
