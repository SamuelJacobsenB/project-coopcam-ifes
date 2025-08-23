package weekly_preference

import (
	"errors"
	"time"

	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/bus-reservation"
	"github.com/google/uuid"
)

type WeeklyPreferenceRequestDTO struct {
	TemplateID uuid.UUID `json:"template_id"`
	WeekStart  time.Time `json:"week_start"`
}

func (dto *WeeklyPreferenceRequestDTO) Validate() error {
	if dto.TemplateID == uuid.Nil {
		return errors.New("id do template é obrigatório")
	}

	if dto.WeekStart.IsZero() {
		return errors.New("data da semana é obrigatória")
	}

	return nil
}

func (dto *WeeklyPreferenceRequestDTO) ToEntity() *WeeklyPreference {
	return &WeeklyPreference{
		TemplateID: dto.TemplateID,
		WeekStart:  dto.WeekStart,
	}
}

type WeeklyPreferenceUpdateDTO struct {
	TemplateID uuid.UUID `json:"template_id"`
	WeekStart  time.Time `json:"week_start"`
}

func (dto *WeeklyPreferenceUpdateDTO) Validate() error {
	if dto.TemplateID == uuid.Nil {
		return errors.New("id do template é obrigatório")
	}

	if dto.WeekStart.IsZero() {
		return errors.New("data da semana é obrigatória")
	}

	return nil
}

func (dto *WeeklyPreferenceUpdateDTO) ToEntity() *WeeklyPreference {
	return &WeeklyPreference{
		TemplateID: dto.TemplateID,
		WeekStart:  dto.WeekStart,
	}
}

type WeeklyPreferenceResponseDTO struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`

	TemplateID uuid.UUID                                   `json:"template_id"`
	WeekStart  time.Time                                   `json:"week_start"`
	Overrides  []bus_reservation.BusReservationResponseDTO `json:"overrides"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
