package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusTripRequestDTO struct {
	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`
}

func (dto *BusTripRequestDTO) Validate() error {
	if dto.Date.IsZero() {
		return errors.New("data é obrigatória")
	}

	if dto.Period == "" {
		return errors.New("período é obrigatório")
	}

	if err := types.ValidatePeriod(dto.Period); err != nil {
		return errors.New(err.Error())
	}

	if err := types.ValidateDirection(dto.Direction); err != nil {
		return errors.New(err.Error())
	}

	return nil
}

func (dto *BusTripRequestDTO) ToEntity() *entities.BusTrip {
	return &entities.BusTrip{
		Date:      dto.Date,
		Period:    dto.Period,
		Direction: dto.Direction,
	}
}

type BusTripUpdateDTO struct {
	Date      *time.Time       `json:"date,omitempty"`
	Period    *types.Period    `json:"period,omitempty"`
	Direction *types.Direction `json:"direction,omitempty"`
}

func (dto *BusTripUpdateDTO) Validate() error {
	if dto.Date != nil && dto.Date.IsZero() {
		return errors.New("data é obrigatória")
	}

	if dto.Period != nil && *dto.Period == "" {
		return errors.New("período é obrigatório")
	}

	if dto.Period != nil {
		if err := types.ValidatePeriod(*dto.Period); err != nil {
			return errors.New(err.Error())
		}
	}

	if dto.Direction != nil {
		if err := types.ValidateDirection(*dto.Direction); err != nil {
			return errors.New(err.Error())
		}
	}

	return nil
}

func (dto *BusTripUpdateDTO) ToEntity() *entities.BusTrip {
	busTrip := entities.BusTrip{}

	if dto.Date != nil {
		busTrip.Date = *dto.Date
	}

	if dto.Period != nil {
		busTrip.Period = *dto.Period
	}

	if dto.Direction != nil {
		busTrip.Direction = *dto.Direction
	}

	return &busTrip
}

type BusTripResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToBusTripResponseDTO(entity *entities.BusTrip) *BusTripResponseDTO {
	return &BusTripResponseDTO{
		ID:        entity.ID,
		Date:      entity.Date,
		Period:    entity.Period,
		Direction: entity.Direction,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
