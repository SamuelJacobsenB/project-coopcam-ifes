package dtos

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
)

type WeeklyPreferenceResponseDTO struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`

	TemplateID uuid.UUID                   `json:"template_id"`
	WeekStart  time.Time                   `json:"week_start"`
	Overrides  []BusReservationResponseDTO `json:"overrides"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToWeeklyPreferenceResponseDTO(entity *entities.WeeklyPreference) *WeeklyPreferenceResponseDTO {
	overridesResponse := make([]BusReservationResponseDTO, len(entity.Overrides))
	for i, override := range entity.Overrides {
		overridesResponse[i] = *ToBusReservationResponseDTO(&override)
	}

	return &WeeklyPreferenceResponseDTO{
		ID:     entity.ID,
		UserID: entity.UserID,

		WeekStart: entity.WeekStart,
		Overrides: overridesResponse,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
