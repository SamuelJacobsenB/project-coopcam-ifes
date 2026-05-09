package dtos

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/security"
)

type LoginDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (loginDTO *LoginDTO) Validate() error {
	if loginDTO.Email == "" || loginDTO.Password == "" {
		return errors.New("email e senha requeridos")
	}

	if err := security.ValidateEmail(loginDTO.Email); err != nil {
		return err
	}

	if err := security.ValidatePassword(loginDTO.Password); err != nil {
		return err
	}

	return nil
}
