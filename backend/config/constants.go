package config

import "time"

// RATE LIMITING
const (
	RateLimitPerMinute = 100
)

// HTTP TIMEOUTS
var (
	HTTPTimeout     = 10 * time.Second
	WebhookTimeout  = 30 * time.Second
	DatabaseTimeout = 5 * time.Second
)

// PASSWORD REQUIREMENTS
const (
	PasswordMinLength  = 12
	PasswordMaxLength  = 128
	PasswordMinEntropy = 50 // bits
)

// JWT CONFIGURATION
const (
	JWTSigningMethod = "HS256"
	JWTMinKeyLength  = 32
)

var (
	JWTExpiryHours = time.Duration(7 * 24 * time.Hour)
)

// DATABASE
const (
	DBMaxOpenConns    = 100
	DBMaxIdleConns    = 10
	DBConnMaxLifetime = time.Hour
)

// REGEX PATTERNS
const (
	EmailPattern    = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	CPFPattern      = `^\d{11}$`
	CEPPattern      = `^\d{8}$`
	PhonePattern    = `^\d{10,11}$`
	PasswordPattern = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{12,128}$`
)

// ERROR MESSAGES
const (
	ErrMsgInvalidEmail     = "email format is invalid"
	ErrMsgInvalidPassword  = "password does not meet requirements"
	ErrMsgInvalidCPF       = "invalid CPF"
	ErrMsgInvalidCEP       = "invalid CEP"
	ErrMsgInvalidPhone     = "invalid phone number"
	ErrMsgUserNotFound     = "user not found"
	ErrMsgEmailExists      = "email already exists"
	ErrMsgInvalidToken     = "invalid or expired token"
	ErrMsgInsufficientRole = "insufficient permissions"
	ErrMsgDatabaseError    = "database operation failed"
)
