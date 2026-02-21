package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
)

type MonthlyFeeConfigRequestDTO struct {
	Month              int       `json:"month"`
	Year               int       `json:"year"`
	BaseAmount         int64     `json:"base_amount"`
	FinancialAidAmount int64     `json:"financial_aid_amount"`
	DueDate            time.Time `json:"due_date"`
}

func (dto *MonthlyFeeConfigRequestDTO) Validate() error {
	if dto.Month < 1 || dto.Month > 12 {
		return errors.New("mês inválido")
	}

	if dto.Year < time.Now().Year() {
		return errors.New("ano inválido")
	}

	if dto.BaseAmount <= 0 {
		return errors.New("valor base deve ser maior que zero")
	}

	if dto.DueDate.IsZero() {
		return errors.New("data de vencimento é obrigatória")
	}

	return nil
}

func (dto *MonthlyFeeConfigRequestDTO) ToEntity() *entities.MonthlyFeeConfig {
	return &entities.MonthlyFeeConfig{
		Month:              dto.Month,
		Year:               dto.Year,
		BaseAmount:         dto.BaseAmount,
		FinancialAidAmount: dto.FinancialAidAmount,
		DueDate:            dto.DueDate,
	}
}

type MonthlyFeeConfigResponseDTO struct {
	ID                 uuid.UUID `json:"id"`
	Month              int       `json:"month"`
	Year               int       `json:"year"`
	BaseAmount         int64     `json:"base_amount"`
	FinancialAidAmount int64     `json:"financial_aid_amount"`
	DueDate            time.Time `json:"due_date"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func ToMonthlyFeeConfigResponseDTO(entity *entities.MonthlyFeeConfig) *MonthlyFeeConfigResponseDTO {
	return &MonthlyFeeConfigResponseDTO{
		ID:                 entity.ID,
		Month:              entity.Month,
		Year:               entity.Year,
		BaseAmount:         entity.BaseAmount,
		FinancialAidAmount: entity.FinancialAidAmount,
		DueDate:            entity.DueDate,
		CreatedAt:          entity.CreatedAt,
		UpdatedAt:          entity.UpdatedAt,
	}
}
