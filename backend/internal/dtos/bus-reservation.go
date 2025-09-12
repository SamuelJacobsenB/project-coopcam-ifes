package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type BusReservationRequestDTO struct {
	UserID uuid.UUID `json:"user_id"`

	Date     time.Time `json:"date"`
	Period   string    `json:"period"`
	Attended *bool     `json:"attended"`
}

func (dto *BusReservationRequestDTO) Validate() error {
	if dto.UserID == uuid.Nil {
		return errors.New("id do usuário é obrigatório")
	}

	if dto.Date.IsZero() {
		return errors.New("data é obrigatória")
	}

	if dto.Period == "" {
		return errors.New("período é obrigatório")
	}

	if err := types.ValidatePeriod(types.Period(dto.Period)); err != nil {
		return errors.New(err.Error())
	}

	return nil
}

func (dto *BusReservationRequestDTO) ToEntity() *entities.BusReservation {
	return &entities.BusReservation{
		UserID:   dto.UserID,
		Date:     dto.Date,
		Period:   types.Period(dto.Period),
		Attended: dto.Attended,
	}
}

type BusReservationUpdateDTO struct {
	Date     *time.Time `json:"date,omitempty"`
	Period   *string    `json:"period,omitempty"`
	Attended *bool      `json:"attended,omitempty"`
}

func (dto *BusReservationUpdateDTO) Validate() error {
	if dto.Date != nil && dto.Date.IsZero() {
		return errors.New("data é obrigatória")
	}

	if dto.Period != nil && *dto.Period == "" {
		return errors.New("período é obrigatório")
	}

	if dto.Period != nil {
		if err := types.ValidatePeriod(types.Period(*dto.Period)); err != nil {
			return errors.New(err.Error())
		}
	}

	return nil
}

func (dto *BusReservationUpdateDTO) ToEntity() *entities.BusReservation {
	busReservation := entities.BusReservation{}

	if dto.Date != nil {
		busReservation.Date = *dto.Date
	}

	if dto.Period != nil {
		busReservation.Period = types.Period(*dto.Period)
	}

	busReservation.Attended = dto.Attended

	return &busReservation
}

type BusReservationResponseDTO struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`

	Date     time.Time    `json:"date"`
	Period   types.Period `json:"period"`
	Attended *bool        `json:"attended"`

	WeeklyPreferenceID *uuid.UUID `json:"weekly_preference_id"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToBusReservationResponseDTO(entity *entities.BusReservation) *BusReservationResponseDTO {
	return &BusReservationResponseDTO{
		ID:     entity.ID,
		UserID: entity.UserID,

		Date:     entity.Date,
		Period:   entity.Period,
		Attended: entity.Attended,

		WeeklyPreferenceID: entity.WeeklyPreferenceID,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}

