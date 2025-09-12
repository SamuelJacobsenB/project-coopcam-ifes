package auth

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/utils"
)

type AuthService struct {
	userRepo *user.UserRepository
}

func NewAuthService(userRepo *user.UserRepository) *AuthService {
	return &AuthService{userRepo}
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

