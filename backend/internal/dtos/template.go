package dtos

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type TemplateRequestDTO struct {
	GoSchedule     types.DaySchedule `json:"go_schedule"`
	ReturnSchedule types.DaySchedule `json:"return_schedule"`
}

func (dto *TemplateRequestDTO) Validate() error {
	if err := types.ValidateDaySchedule(&dto.GoSchedule); err != nil {
		return err
	}

	if err := types.ValidateDaySchedule(&dto.ReturnSchedule); err != nil {
		return err
	}

	return nil
}

func (dto *TemplateRequestDTO) ToEntity() *entities.Template {
	return &entities.Template{
		GoSchedule:     dto.GoSchedule,
		ReturnSchedule: dto.ReturnSchedule,
	}
}

type TemplateUpdateRequestDTO struct {
	GoSchedule     types.DaySchedule `json:"go_schedule"`
	ReturnSchedule types.DaySchedule `json:"return_schedule"`
}

func (dto *TemplateUpdateRequestDTO) Validate() error {
	if err := types.ValidateDaySchedule(&dto.GoSchedule); err != nil {
		return err
	}

	if err := types.ValidateDaySchedule(&dto.ReturnSchedule); err != nil {
		return err
	}

	return nil
}

func (dto *TemplateUpdateRequestDTO) ToEntity() *entities.Template {
	return &entities.Template{
		GoSchedule:     dto.GoSchedule,
		ReturnSchedule: dto.ReturnSchedule,
	}
}

type TemplateResponseDTO struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`

	GoSchedule     types.DaySchedule `json:"go_schedule"`
	ReturnSchedule types.DaySchedule `json:"return_schedule"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToTemplateResponseDTO(entity *entities.Template) *TemplateResponseDTO {
	return &TemplateResponseDTO{
		ID:     entity.ID,
		UserID: entity.UserID,

		GoSchedule:     entity.GoSchedule,
		ReturnSchedule: entity.ReturnSchedule,

		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}

