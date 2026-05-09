package security

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
)

func ValidateEmail(email string) error {
	email = strings.TrimSpace(email)

	if email == "" {
		return errors.New("email é obrigatório")
	}

	if len(email) > 254 {
		return errors.New("email é muito longo")
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
		return errors.New("o CPF deve ter 11 dígitos")
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
		return errors.New("o primeiro dígito verificador do CPF é inválido")
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
		return errors.New("o segundo dígito verificador do CPF é inválido")
	}

	return nil
}

func ValidateCEP(cep string) error {
	cep = regexp.MustCompile(`\D`).ReplaceAllString(cep, "")

	if len(cep) != 8 {
		return errors.New("o CEP deve ter 8 dígitos")
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
		return errors.New(config.ErrMsgInvalidPhone)
	}

	return nil
}

func ValidateName(name string) error {
	name = strings.TrimSpace(name)

	if name == "" {
		return errors.New("nome é obrigatório")
	}

	if len(name) < 3 {
		return errors.New("nome deve ter pelo menos 3 caracteres")
	}

	if len(name) > 64 {
		return errors.New("nome deve ter no máximo 64 caracteres")
	}

	return nil
}

func ValidatePassword(password string) error {
	if len(password) < config.PasswordMinLength {
		return errors.New("senha deve ter no mínimo " +
			fmt.Sprint(config.PasswordMinLength) + " caracteres")
	}

	if len(password) > config.PasswordMaxLength {
		return errors.New("senha deve ter no máximo " + fmt.Sprint(config.PasswordMaxLength) + " caracteres")
	}

	if strings.Contains(password, " ") {
		return errors.New("senha não pode conter espaços")
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
		return errors.New("senha deve conter letra maiúscula")
	}
	if !hasLower {
		return errors.New("senha deve conter letra minúscula")
	}
	if !hasDigit {
		return errors.New("senha deve conter um número")
	}
	if !hasSpecial {
		return errors.New("senha deve conter um caractere especial (!@#$%^&*)")
	}

	return nil
}
