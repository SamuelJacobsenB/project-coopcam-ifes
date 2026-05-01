package security

import (
	"errors"
	"regexp"
	"strings"
	"unicode"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
)

func ValidateEmail(email string) error {
	email = strings.TrimSpace(email)

	if email == "" {
		return errors.New("email is required")
	}

	if len(email) > 254 {
		return errors.New("email is too long")
	}

	matched, err := regexp.MatchString(config.EmailPattern, email)
	if err != nil || !matched {
		return errors.New(config.ErrMsgInvalidEmail)
	}

	return nil
}

func ValidateCPF(cpf string) error {
	// Remove formatação
	cpf = regexp.MustCompile(`\D`).ReplaceAllString(cpf, "")

	if len(cpf) != 11 {
		return errors.New("CPF must have 11 digits")
	}

	invalidSequences := []string{
		"00000000000", "11111111111", "22222222222", "33333333333",
		"44444444444", "55555555555", "66666666666", "77777777777",
		"88888888888", "99999999999",
	}

	for _, seq := range invalidSequences {
		if cpf == seq {
			return errors.New(config.ErrMsgInvalidCPF)
		}
	}

	// Validar primeiro dígito verificador
	sum := 0
	for i := range 9 {
		digit := int(cpf[i] - '0')
		sum += digit * (10 - i)
	}

	firstRemainder := sum % 11
	firstVerifier := 0
	if firstRemainder >= 2 {
		firstVerifier = 11 - firstRemainder
	}

	if int(cpf[9]-'0') != firstVerifier {
		return errors.New("invalid CPF checksum")
	}

	// Validar segundo dígito verificador
	sum = 0
	for i := 0; i < 10; i++ {
		digit := int(cpf[i] - '0')
		sum += digit * (11 - i)
	}

	secondRemainder := sum % 11
	secondVerifier := 0
	if secondRemainder >= 2 {
		secondVerifier = 11 - secondRemainder
	}

	if int(cpf[10]-'0') != secondVerifier {
		return errors.New("invalid CPF checksum")
	}

	return nil
}

func ValidateCEP(cep string) error {
	cep = regexp.MustCompile(`\D`).ReplaceAllString(cep, "")

	if len(cep) != 8 {
		return errors.New("CEP must have 8 digits")
	}

	matched, err := regexp.MatchString(config.CEPPattern, cep)
	if err != nil || !matched {
		return errors.New(config.ErrMsgInvalidCEP)
	}

	return nil
}

func ValidatePhone(phone string) error {
	phone = regexp.MustCompile(`\D`).ReplaceAllString(phone, "")

	if len(phone) < 10 || len(phone) > 11 {
		return errors.New("phone must have 10 or 11 digits")
	}

	return nil
}

func ValidateName(name string) error {
	name = strings.TrimSpace(name)

	if name == "" {
		return errors.New("name is required")
	}

	if len(name) < 3 {
		return errors.New("name must have at least 3 characters")
	}

	if len(name) > 64 {
		return errors.New("name is too long")
	}

	return nil
}

func ValidatePassword(password string) error {
	if len(password) < config.PasswordMinLength {
		return errors.New("password is too short (minimum " +
			string(rune(config.PasswordMinLength)) + " characters)")
	}

	if len(password) > config.PasswordMaxLength {
		return errors.New("password is too long")
	}

	if strings.Contains(password, " ") {
		return errors.New("password cannot contain spaces")
	}

	hasUpper := false
	hasLower := false
	hasDigit := false
	hasSpecial := false

	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		case unicode.IsSymbol(r) || unicode.IsPunct(r):
			hasSpecial = true
		}
	}

	if !hasUpper {
		return errors.New("password must contain uppercase letter")
	}
	if !hasLower {
		return errors.New("password must contain lowercase letter")
	}
	if !hasDigit {
		return errors.New("password must contain number")
	}
	if !hasSpecial {
		return errors.New("password must contain special character (!@#$%^&*)")
	}

	return nil
}
