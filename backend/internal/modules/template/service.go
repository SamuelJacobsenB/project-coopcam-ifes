package template

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
)

type TemplateService struct {
	repo     *TemplateRepository
	userRepo *user.UserRepository
}

func NewTemplateService(repo *TemplateRepository, userRepo *user.UserRepository) *TemplateService {
	return &TemplateService{repo, userRepo}
}

func (service *TemplateService) FindByUserID(userID uuid.UUID) (*entities.Template, error) {
	return service.repo.FindByUserID(userID)
}

func (service *TemplateService) Create(template *entities.Template) error {
	userExists, err := service.userRepo.FindByID(template.UserID)
	if err != nil {
		return err
	}
	if userExists == nil {
		return errors.New("user not found")
	}

	templateExists, err := service.repo.FindByUserID(template.UserID)
	if err != nil {
		return err
	}
	if templateExists != nil {
		return errors.New("template already exists")
	}

	return service.repo.Create(template)
}

func (service *TemplateService) Update(template *entities.Template) error {
	return service.repo.Update(template)
}

func (service *TemplateService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}

