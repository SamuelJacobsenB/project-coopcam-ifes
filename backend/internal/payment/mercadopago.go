package payment

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type MPPaymentResponse struct {
	ID                 int64  `json:"id"`
	Status             string `json:"status"`
	PointOfInteraction struct {
		TransactionData struct {
			TicketURL string `json:"ticket_url"`
			QRCode    string `json:"qr_code"`
		} `json:"transaction_data"`
	} `json:"point_of_interaction"`
}

type MercadoPagoClient struct {
	AccessToken     string
	BaseURL         string
	NotificationURL string // Para onde o MP vai mandar o Webhook
}

func NewMercadoPagoClient() *MercadoPagoClient {
	return &MercadoPagoClient{
		AccessToken:     os.Getenv("MP_ACCESS_TOKEN"),
		BaseURL:         "https://api.mercadopago.com/v1",
		NotificationURL: os.Getenv("MP_WEBHOOK_URL"),
	}
}

// CreatePixPayment solicita um QR Code PIX ao Mercado Pago
func (c *MercadoPagoClient) CreatePixPayment(ctx context.Context, amountCents int64, email string, internalID string, dueDate time.Time) (*MPPaymentResponse, error) {
	url := fmt.Sprintf("%s/payments", c.BaseURL)

	// Garante que o Pix expire no final do dia do vencimento (23:59:59)
	expiration := time.Date(dueDate.Year(), dueDate.Month(), dueDate.Day(), 23, 59, 59, 0, dueDate.Location())

	payload := map[string]interface{}{
		"transaction_amount": float64(amountCents) / 100.0,
		"payment_method_id":  "pix",
		"description":        "Mensalidade Coopcam",
		"external_reference": internalID, // Vincula ao banco
		"notification_url":   c.NotificationURL,
		"date_of_expiration": expiration.Format("2006-01-02T15:04:05.000-07:00"),
		"payer": map[string]interface{}{
			"email": email,
		},
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.AccessToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Idempotency-Key", internalID)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		errorBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("erro %d no Mercado Pago: %s", resp.StatusCode, string(errorBody))
	}

	var result MPPaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func (c *MercadoPagoClient) GetPayment(ctx context.Context, paymentID string) (*MPPaymentResponse, error) {
	url := fmt.Sprintf("%s/payments/%s", c.BaseURL, paymentID)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+c.AccessToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("erro %d ao buscar pagamento", resp.StatusCode)
	}

	var result MPPaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}
