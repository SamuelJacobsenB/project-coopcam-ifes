package user

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/utils"
	"github.com/google/uuid"
)

type UserService struct {
	repo *UserRepository
}

func NewUserService(repo *UserRepository) *UserService {
	return &UserService{repo}
}

func (service *UserService) FindAll() ([]entities.User, error) {
	return service.repo.FindAll()
}

func (service *UserService) FindByID(id uuid.UUID) (*entities.User, error) {
	return service.repo.FindByID(id)
}

func (service *UserService) Create(user *entities.User) error {
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}

	user.Password = hashedPassword

	return service.repo.Create(user)
}

func (service *UserService) Update(user *entities.User) error {
	if user.Password != "" {
		hashedPassword, err := utils.HashPassword(user.Password)
		if err != nil {
			return err
		}

		user.Password = hashedPassword
	}

	return service.repo.Update(user)
}

// Add Logic
func (service *UserService) UpdateAvatarURL(avatarURL string, id uuid.UUID) error {
	return service.repo.UpdateAvatarURL(avatarURL, id)
}

func (service *UserService) PromoteToCoordinator(id uuid.UUID) error {
	return service.repo.PromoteToCoordinator(id)
}

func (service *UserService) DemoteFromCoordinator(id uuid.UUID) error {
	return service.repo.DemoteFromCoordinator(id)
}

func (service *UserService) PromoteToAdmin(id uuid.UUID) error {
	return service.repo.PromoteToAdmin(id)
}

func (service *UserService) DemoteFromAdmin(id uuid.UUID) error {
	return service.repo.DemoteFromAdmin(id)
}

func (service *UserService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}

