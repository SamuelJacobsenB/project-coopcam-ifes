package template

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/google/uuid"
)

type TemplateService struct {
	repo *TemplateRepository
}

func NewTemplateService(repo *TemplateRepository) *TemplateService {
	return &TemplateService{repo}
}

func (service *TemplateService) FindByUserID(userID uuid.UUID) (*entities.Template, error) {
	return service.repo.FindByUserID(userID)
}

// Verify if user exists
// Verify if template exists
func (service *TemplateService) Create(template *entities.Template) error {
	return service.repo.Create(template)
}

func (service *TemplateService) Update(template *entities.Template) error {
	return service.repo.Update(template)
}

func (service *TemplateService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
