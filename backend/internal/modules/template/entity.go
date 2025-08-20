package template

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type Template struct {
	ID             uuid.UUID         `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID         uuid.UUID         `gorm:"type:uuid;index"`
	GoSchedule     types.DaySchedule `gorm:"embedded"`
	ReturnSchedule types.DaySchedule `gorm:"embedded"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
