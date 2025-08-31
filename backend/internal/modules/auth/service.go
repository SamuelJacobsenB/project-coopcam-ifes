package auth

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/utils"
)

type AuthService struct {
	userRepo *user.UserRepository
}

func NewAuthService() *AuthService {
	return &AuthService{}
}

func (service *AuthService) Login(loginDTO *dtos.LoginDTO) (string, error) {
	user, err := service.userRepo.FindByEmail(loginDTO.Email)
	if err != nil {
		return "", err
	}

	if !utils.CheckPasswordHash(loginDTO.Password, user.Password) {
		return "", errors.New("email ou senha incorretos")
	}

	return utils.GenerateJWT(user.ID, user.Roles)
}
