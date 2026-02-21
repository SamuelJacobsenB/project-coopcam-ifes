package entities

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
)

type MonthlyPayment struct {
	ID     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_user_month_year;not null" json:"user_id"`

	Month int `gorm:"uniqueIndex:idx_user_month_year;not null" json:"month"`
	Year  int `gorm:"uniqueIndex:idx_user_month_year;not null" json:"year"`

	AmountDue     int64               `gorm:"not null" json:"amount_due"`
	PaymentStatus types.PaymentStatus `gorm:"type:text;default:'draft'" json:"payment_status"`
	DueDate       time.Time           `gorm:"not null" json:"due_date"`

	ExternalID *string `gorm:"type:text;uniqueIndex" json:"external_id"`
	PaymentURL *string `gorm:"type:text" json:"payment_url"`
	PixQRCode  *string `gorm:"type:text" json:"pix_qr_code"`

	PaidAt *time.Time `json:"paid_at"`

	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// IsEmitable verifica se o pagamento ainda está em rascunho para ser enviado ao gateway
func (m *MonthlyPayment) IsEmitable() bool {
	return m.PaymentStatus == types.PaymentDraft && (m.ExternalID == nil || *m.ExternalID == "")
}

// MarkAsEmitted vincula os dados do Mercado Pago e muda o status
func (m *MonthlyPayment) MarkAsEmitted(externalID, url, qrCode string) {
	m.ExternalID = &externalID
	m.PaymentURL = &url
	m.PixQRCode = &qrCode
	m.PaymentStatus = types.PaymentPending
}
