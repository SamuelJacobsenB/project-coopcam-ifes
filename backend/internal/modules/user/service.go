package user

import (
	"errors"

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

func (service *UserService) FindPaginated(offset, limit int, namePrefix string) ([]entities.User, error) {
	return service.repo.FindPaginated(offset, limit, namePrefix)
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
	oldUser, err := service.repo.FindByID(user.ID)
	if err != nil {
		return err
	}
	if oldUser == nil {
		return errors.New("user not found")
	}

	if user.Password != "" {
		hashedPassword, err := utils.HashPassword(user.Password)
		if err != nil {
			return err
		}

		user.Password = hashedPassword
	} else {
		user.Password = oldUser.Password
	}

	return service.repo.Update(user)
}

func (service *UserService) PromoteToDriver(id uuid.UUID) error {
	return service.repo.PromoteToDriver(id)
}

func (service *UserService) PromoteToAdmin(id uuid.UUID) error {
	return service.repo.PromoteToAdmin(id)
}

func (service *UserService) DemoteToUser(id uuid.UUID) error {
	return service.repo.DemoteToUser(id)
}

func (service *UserService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
