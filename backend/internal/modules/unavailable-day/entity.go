package unavailable_day

import (
	"time"

	"github.com/google/uuid"
)

type UnavailableDay struct {
	ID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`

	Date   time.Time `json:"date"`
	Reason string    `json:"reason"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
