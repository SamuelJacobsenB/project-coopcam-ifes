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
	PasswordMinLength  = 8
	PasswordMaxLength  = 15
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
	PasswordPattern = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,15}$`
)

// ERROR MESSAGES
const (
	ErrMsgInvalidEmail     = "formato de email inválido"
	ErrMsgInvalidPassword  = "senha deve ter entre 8 e 15 caracteres, com pelo menos uma letra maiúscula, um número e um caractere especial"
	ErrMsgInvalidCPF       = "o CPF deve ser válido"
	ErrMsgInvalidCEP       = "o CEP deve ter 8 dígitos"
	ErrMsgInvalidPhone     = "telefone deve ter 10 ou 11 dígitos"
	ErrMsgUserNotFound     = "usuário não encontrado"
	ErrMsgEmailExists      = "email ja cadastrado"
	ErrMsgInvalidToken     = "token inválido"
	ErrMsgInsufficientRole = "permissão insuficiente"
	ErrMsgDatabaseError    = "erro ao acessar o banco de dados"
)
