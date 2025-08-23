package validators

import (
	"errors"
	"regexp"
)

func ValidateCPF(cpf string) error {
	matched, err := regexp.MatchString(`^\d{11}$`, cpf)

	if !matched || err != nil {
		return errors.New("cpf inválido")
	}

	return nil
}
