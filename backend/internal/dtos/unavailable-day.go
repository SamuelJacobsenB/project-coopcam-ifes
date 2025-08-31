package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
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

	if dto.Reason == "" {
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

type UnavailableDayUpdateDTO struct {
	Date   *time.Time `json:"date,omitempty"`
	Reason *string    `json:"reason,omitempty"`
}

func (dto *UnavailableDayUpdateDTO) Validate() error {
	if dto.Date != nil && dto.Date.IsZero() {
		return errors.New("data deve ser válida")
	}

	if dto.Reason != nil && *dto.Reason == "" {
		return errors.New("motivo deve ser válido")
	}

	return nil
}

func (dto *UnavailableDayUpdateDTO) ToEntity() *entities.UnavailableDay {
	availableOverride := entities.UnavailableDay{}

	if dto.Date != nil {
		availableOverride.Date = *dto.Date
	}

	if dto.Reason != nil {
		availableOverride.Reason = *dto.Reason
	}

	return &availableOverride
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
