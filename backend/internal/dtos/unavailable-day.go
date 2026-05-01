package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
)

type UnavailableDayRequestDTO struct {
	Date   time.Time `json:"date"`
	Reason string    `json:"reason"`
}

func (dto *UnavailableDayRequestDTO) Validate() error {
	if dto.Date.IsZero() {
		return errors.New("data é obrigatória")
	}

	if dto.Reason == "" || len(dto.Reason) > 128 {
		return errors.New("motivo é obrigatório")
	}

	return nil
}

func (dto *UnavailableDayRequestDTO) ToEntity() *entities.UnavailableDay {
	return &entities.UnavailableDay{
		Date:   dto.Date,
		Reason: dto.Reason,
	}
}

type UnavailableDayResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Date   time.Time `json:"date"`
	Reason string    `json:"reason"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToUnavailableDayResponseDTO(entity *entities.UnavailableDay) *UnavailableDayResponseDTO {
	return &UnavailableDayResponseDTO{
		ID: entity.ID,

		Date:   entity.Date,
		Reason: entity.Reason,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
