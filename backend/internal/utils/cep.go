package utils

import (
	"errors"
	"regexp"
)

func ValidateCEP(cep string) error {
	matched, err := regexp.MatchString(`^\d{8}$`, cep)

	if !matched || err != nil {
		return errors.New("cep inválido")
	}

	return nil
}
