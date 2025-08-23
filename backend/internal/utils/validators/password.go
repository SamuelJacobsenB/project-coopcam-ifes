package validators

import (
	"errors"
	"unicode"
)

func ValidatePassword(password string) error {
	if len(password) < 8 || len(password) > 15 {
		return errors.New("senha deve ter entre 8 e 15 caracteres")
	}

	hasLetter := false
	hasNumber := false

	for _, r := range password {
		switch {
		case unicode.IsLetter(r):
			hasLetter = true
		case unicode.IsDigit(r):
			hasNumber = true
		}
	}

	if !hasLetter {
		return errors.New("senha deve conter pelo menos uma letra")
	}
	if !hasNumber {
		return errors.New("senha deve conter pelo menos um número")
	}

	return nil
}
