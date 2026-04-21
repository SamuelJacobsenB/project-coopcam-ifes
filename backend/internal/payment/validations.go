package payment

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
)

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

	// Montar a string de manifesto conforme regra do MP:
	// "id:[ID-DA-REQUISICAO];request-id:[X-REQUEST-ID];ts:[TIMESTAMP];"
	// No caso de notificações v2, o formato é:
	manifest := fmt.Sprintf("id:%s;request-id:%s;ts:%s;", requestID, requestID, ts)

	// Gerar o HMAC-SHA256 usando secret
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(manifest))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	return hmac.Equal([]byte(v1), []byte(expectedSignature))
}
