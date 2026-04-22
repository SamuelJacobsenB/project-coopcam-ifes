package dtos

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type MonthlyPaymentResponseDTO struct {
	ID            uuid.UUID           `json:"id"`
	UserID        uuid.UUID           `json:"user_id"`
	UserName      string              `json:"user_name"`
	Month         int                 `json:"month"`
	Year          int                 `json:"year"`
	Amount        float64             `json:"amount"`
	PaymentStatus types.PaymentStatus `json:"payment_status"`
	DueDate       time.Time           `json:"due_date"`
	PaymentURL    *string             `json:"payment_url,omitempty"`
	PixQRCode     *string             `json:"pix_qr_code,omitempty"`
	PaidAt        *time.Time          `json:"paid_at,omitempty"`
}

func ToMonthlyPaymentResponse(p entities.MonthlyPayment) MonthlyPaymentResponseDTO {
	return MonthlyPaymentResponseDTO{
		ID:            p.ID,
		UserID:        p.UserID,
		UserName:      p.UserName,
		Month:         p.Month,
		Year:          p.Year,
		Amount:        float64(p.AmountDue) / 100.0,
		PaymentStatus: p.PaymentStatus,
		DueDate:       p.DueDate,
		PaymentURL:    p.PaymentURL,
		PixQRCode:     p.PixQRCode,
		PaidAt:        p.PaidAt,
	}
}

func ToMonthlyPaymentListResponse(payments []entities.MonthlyPayment) []MonthlyPaymentResponseDTO {
	list := make([]MonthlyPaymentResponseDTO, len(payments))
	for i, p := range payments {
		list[i] = ToMonthlyPaymentResponse(p)
	}
	return list
}
