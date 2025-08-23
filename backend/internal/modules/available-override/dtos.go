package available_override

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type AvailableOverrideRequestDTO struct {
	Date   time.Time `json:"date"`
	Reason string    `json:"reason"`
}

func (dto *AvailableOverrideRequestDTO) Validate() error {
	if dto.Date.IsZero() {
		return errors.New("data é obrigatória")
	}

	if dto.Reason == "" {
		return errors.New("motivo é obrigatório")
	}

	return nil
}

func (dto *AvailableOverrideRequestDTO) ToEntity() *AvailableOverride {
	return &AvailableOverride{
		Date:   dto.Date,
		Reason: dto.Reason,
	}
}

type AvailableOverrideUpdateDTO struct {
	Date   *time.Time `json:"date,omitempty"`
	Reason *string    `json:"reason,omitempty"`
}

func (dto *AvailableOverrideUpdateDTO) Validate() error {
	if dto.Date != nil && dto.Date.IsZero() {
		return errors.New("data deve ser válida")
	}

	if dto.Reason != nil && *dto.Reason == "" {
		return errors.New("motivo deve ser válido")
	}

	return nil
}

func (dto *AvailableOverrideUpdateDTO) ToEntity() *AvailableOverride {
	availableOverride := AvailableOverride{}

	if dto.Date != nil {
		availableOverride.Date = *dto.Date
	}

	if dto.Reason != nil {
		availableOverride.Reason = *dto.Reason
	}

	return &availableOverride
}

type AvailableOverrideResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Date   time.Time `json:"date"`
	Reason string    `json:"reason"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
