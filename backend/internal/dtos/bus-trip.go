package dtos

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type BusTripResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`
	Status    types.Status    `json:"status"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToBusTripResponseDTO(entity *entities.BusTrip) *BusTripResponseDTO {
	return &BusTripResponseDTO{
		ID:        entity.ID,
		Date:      entity.Date,
		Period:    entity.Period,
		Direction: entity.Direction,
		Status:    entity.Status,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
