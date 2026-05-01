package security

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	jwtKey []byte
)

func InitJWT() error {
	keyStr := os.Getenv("JWT_KEY")
	if keyStr == "" {
		return errors.New("JWT_KEY environment variable is required")
	}

	if len(keyStr) < config.JWTMinKeyLength {
		return fmt.Errorf("JWT_KEY must be at least %d characters long", config.JWTMinKeyLength)
	}

	jwtKey = []byte(keyStr)
	return nil
}

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID uuid.UUID, email, role string) (string, error) {
	if userID == uuid.Nil {
		return "", errors.New("user_id cannot be nil")
	}
	if email == "" {
		return "", errors.New("email cannot be empty")
	}
	if role == "" {
		return "", errors.New("role cannot be empty")
	}

	now := time.Now()
	expiresAt := now.Add(config.JWTExpiryHours * time.Hour)

	claims := Claims{
		UserID: userID.String(),
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

func ValidateToken(tokenString string) (*Claims, error) {
	if tokenString == "" {
		return nil, errors.New("token is empty")
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Verificar que o método de assinatura é HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	if claims.UserID == "" {
		return nil, errors.New("missing user_id in token")
	}
	if claims.Role == "" {
		return nil, errors.New("missing role in token")
	}

	return claims, nil
}
