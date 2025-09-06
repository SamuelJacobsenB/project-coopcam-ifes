package entities

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusTrip struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `gorm:"type:text" json:"period"`
	Direction types.Direction `gorm:"type:text" json:"direction"`
	Status    types.Status    `gorm:"type:text" json:"status"`
	
	Reports []BusTripReport `gorm:"foreignKey:BusTripID" json:"reports"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (BusTrip) TableName() string {
	return "bus_trips"
}
