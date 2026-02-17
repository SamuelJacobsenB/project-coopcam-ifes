package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
)

type MonthlyPaymentRequestDTO struct {
	UserID uuid.UUID `json:"user_id"`
	Month  int       `json:"month"`
	Year   int       `json:"year"`
}

func (dto *MonthlyPaymentRequestDTO) Validate() error {
	if dto.UserID == uuid.Nil {
		return errors.New("user_id é obrigatório")
	}
	if dto.Month < 1 || dto.Month > 12 {
		return errors.New("mês deve ser entre 1 e 12")
	}
	if dto.Year < time.Now().Year() { // Exemplo de validação
		return errors.New("ano inválido")
	}
	return nil
}

func (dto *MonthlyPaymentRequestDTO) ToEntity() *entities.MonthlyPayment {
	return &entities.MonthlyPayment{
		UserID: dto.UserID,
		Month:  dto.Month,
		Year:   dto.Year,
		IsPaid: false,
	}
}

type MonthlyPaymentUpdateDTO struct {
	IsPaid bool `json:"is_paid"`
}

type MonthlyPaymentResponseDTO struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`
	Month  int       `json:"month"`
	Year   int       `json:"year"`
	IsPaid bool      `json:"is_paid"`
	PaidAt *string   `json:"paid_at"`

	CreatedAt time.Time `json:"created_at"`
}

func ToMonthlyPaymentResponseDTO(entity *entities.MonthlyPayment) *MonthlyPaymentResponseDTO {
	var paidAtStr *string
	if entity.PaidAt != nil {
		formatted := entity.PaidAt.Format("02/01/2006 15:04")
		paidAtStr = &formatted
	}

	return &MonthlyPaymentResponseDTO{
		ID:        entity.ID,
		UserID:    entity.UserID,
		Month:     entity.Month,
		Year:      entity.Year,
		IsPaid:    entity.IsPaid,
		PaidAt:    paidAtStr,
		CreatedAt: entity.CreatedAt,
	}
}
