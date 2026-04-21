package dtos

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type BusTripReportResponseDTO struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	BusTripID uuid.UUID `json:"bus_trip_id"`

	UserName string `json:"user_name"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`
	Marked    bool            `json:"marked"`
	Attended  bool            `json:"attended"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToBusTripReportResponseDTO(entity *entities.BusTripReport) *BusTripReportResponseDTO {
	return &BusTripReportResponseDTO{
		ID:        entity.ID,
		UserID:    entity.UserID,
		BusTripID: entity.BusTripID,

		UserName: entity.UserName,

		Date:      entity.Date,
		Period:    entity.Period,
		Direction: entity.Direction,
		Marked:    entity.Marked,
		Attended:  entity.Attended,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
