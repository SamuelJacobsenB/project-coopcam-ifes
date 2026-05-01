package payment

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"
)

// ✅ SEGURANÇA: Valida assinatura do Mercado Pago com proteção contra replay
func ValidateMercadoPagoSignature(signatureHeader, requestID, secret string) bool {
	// Separar o timestamp (ts) e o hash (v1) do header
	parts := strings.Split(signatureHeader, ",")
	var ts, v1 string
	for _, part := range parts {
		kv := strings.Split(part, "=")
		if len(kv) != 2 {
			continue
		}
		if kv[0] == "ts" {
			ts = kv[1]
		}
		if kv[0] == "v1" {
			v1 = kv[1]
		}
	}

	if ts == "" || v1 == "" {
		return false
	}

	// ✅ NOVO: Validar timestamp para proteção contra replay
	// Rejeitar webhooks com mais de 5 minutos de idade
	timestamp, err := strconv.ParseInt(ts, 10, 64)
	if err != nil {
		return false
	}

	nowUnix := time.Now().Unix()
	if nowUnix-timestamp > 300 { // 5 minutos em segundos
		return false // Webhook expirado
	}
	if timestamp > nowUnix+60 { // Permitir até 1 minuto de clock skew
		return false // Timestamp no futuro (suspeito)
	}

	// Montar a string de manifesto conforme regra do MP:
	// "id:[ID-DA-REQUISICAO];request-id:[X-REQUEST-ID];ts:[TIMESTAMP];"
	manifest := fmt.Sprintf("id:%s;request-id:%s;ts:%s;", requestID, requestID, ts)

	// Gerar o HMAC-SHA256 usando secret
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(manifest))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	return hmac.Equal([]byte(v1), []byte(expectedSignature))
}
