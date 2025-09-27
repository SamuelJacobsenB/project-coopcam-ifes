package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type BusReservationRequestDTO struct {
	BusTripID uuid.UUID `json:"bus_trip_id"`

	UserID   uuid.UUID `json:"user_id"`
	UserName string    `json:"user_name"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`
}

func (dto *BusReservationRequestDTO) Validate() error {
	if dto.BusTripID == uuid.Nil {
		return errors.New("id da viagem é obrigatório")
	}

	if dto.UserID == uuid.Nil {
		return errors.New("id do usuário é obrigatório")
	}

	if dto.UserName == "" {
		return errors.New("nome do usuário é obrigatório")
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

	if dto.Direction == "" {
		return errors.New("direção é obrigatória")
	}

	if err := types.ValidateDirection(dto.Direction); err != nil {
		return errors.New(err.Error())
	}

	return nil
}

func (dto *BusReservationRequestDTO) ToEntity() *entities.BusReservation {
	return &entities.BusReservation{
		BusTripID: dto.BusTripID,
		UserID:    dto.UserID,
		UserName:  dto.UserName,
		Date:      dto.Date,
		Period:    types.Period(dto.Period),
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

	if dto.Period != nil {
		if *dto.Period == "" {
			return errors.New("período é obrigatório")
		}

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

	return &busReservation
}

type BusReservationResponseDTO struct {
	ID                 uuid.UUID `json:"id"`
	WeeklyPreferenceID uuid.UUID `json:"weekly_preference_id"`
	BusReservationID   uuid.UUID `json:"bus_reservation_id"`

	UserID   uuid.UUID `json:"user_id"`
	UserName string    `json:"user_name"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`

	WeeklyPreference *WeeklyPreferenceResponseDTO `json:"weekly_preference"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToBusReservationResponseDTO(entity *entities.BusReservation) *BusReservationResponseDTO {
	return &BusReservationResponseDTO{
		ID:                 entity.ID,
		WeeklyPreferenceID: entity.WeeklyPreferenceID,
		BusReservationID:   entity.ID,

		UserID:   entity.UserID,
		UserName: entity.UserName,

		Date:      entity.Date,
		Period:    entity.Period,
		Direction: entity.Direction,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
