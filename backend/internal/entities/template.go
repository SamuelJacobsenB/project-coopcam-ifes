package entities

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type Template struct {
	ID     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;index" json:"user_id"`

	GoSchedule     types.DaySchedule `gorm:"embedded;embeddedPrefix:go_" json:"go_schedule"`
	ReturnSchedule types.DaySchedule `gorm:"embedded;embeddedPrefix:return_" json:"return_schedule"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Template) TableName() string {
	return "templates"
}
