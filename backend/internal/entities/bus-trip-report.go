package entities

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusTripReport struct {
	ID     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;index" json:"user_id"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `gorm:"type:text" json:"period"`
	Direction types.Direction `gorm:"type:text" json:"direction"`
	Marked    bool            `json:"marked"`
	Attended  bool            `json:"attended"`

	User *User `gorm:"foreignKey:UserID" json:"user"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (BusTripReport) TableName() string {
	return "bus_trip_reports"
}
