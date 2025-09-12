package entities

import (
	"time"

	"github.com/google/uuid"
)

type AvailableOverride struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`

	Date   time.Time `json:"date"`
	Reason string    `json:"reason"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (AvailableOverride) TableName() string {
	return "available_overrides"
}

