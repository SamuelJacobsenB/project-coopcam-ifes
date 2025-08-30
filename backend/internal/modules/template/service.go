package template

import "github.com/google/uuid"

type TemplateService struct {
	repo *TemplateRepository
}

func NewTemplateService(repo *TemplateRepository) *TemplateService {
	return &TemplateService{repo}
}

func (service *TemplateService) FindByUserID(userID uuid.UUID) (*Template, error) {
	return service.repo.FindByUserID(userID)
}

// Verify if user exists
// Verify if template exists
func (service *TemplateService) Create(template *Template) error {
	return service.repo.Create(template)
}

func (service *TemplateService) Update(template *Template) error {
	return service.repo.Update(template)
}

func (service *TemplateService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
