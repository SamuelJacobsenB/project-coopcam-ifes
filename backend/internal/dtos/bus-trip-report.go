package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusTripReportRequestDTO struct {
	UserID uuid.UUID `json:"user_id"`

	Date      time.Time       `json:"date"`
	Period    types.Period    `json:"period"`
	Direction types.Direction `json:"direction"`
	Marked    bool            `json:"marked"`
	Attended  bool            `json:"attended"`
}

func (dto *BusTripReportRequestDTO) Validate() error {
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

	if err := types.ValidateDirection(dto.Direction); err != nil {
		return errors.New(err.Error())
	}

	return nil
}

func (dto *BusTripReportRequestDTO) ToEntity() *entities.BusTripReport {
	return &entities.BusTripReport{
		UserID:    dto.UserID,
		Date:      dto.Date,
		Period:    dto.Period,
		Direction: dto.Direction,
		Marked:    dto.Marked,
		Attended:  dto.Attended,
	}
}

type BusTripReportUpdateDTO struct {
	Date      *time.Time       `json:"date,omitempty"`
	Period    *types.Period    `json:"period,omitempty"`
	Direction *types.Direction `json:"direction,omitempty"`
	Marked    *bool            `json:"marked,omitempty"`
	Attended  *bool            `json:"attended,omitempty"`
}

func (dto *BusTripReportUpdateDTO) Validate() error {
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

func (dto *BusTripReportUpdateDTO) ToEntity() *entities.BusTripReport {
	busTripReport := entities.BusTripReport{}

	if dto.Date != nil {
		busTripReport.Date = *dto.Date
	}

	if dto.Period != nil {
		busTripReport.Period = *dto.Period
	}

	if dto.Direction != nil {
		busTripReport.Direction = *dto.Direction
	}

	if dto.Marked != nil {
		busTripReport.Marked = *dto.Marked
	}

	if dto.Attended != nil {
		busTripReport.Attended = *dto.Attended
	}

	return &busTripReport
}

type BusTripReportResponseDTO struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`

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
		ID:     entity.ID,
		UserID: entity.UserID,

		Date:      entity.Date,
		Period:    entity.Period,
		Direction: entity.Direction,
		Marked:    entity.Marked,
		Attended:  entity.Attended,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
