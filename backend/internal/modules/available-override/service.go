package available_override

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/google/uuid"
)

type AvailableOverrideService struct {
	repo *AvailableOverrideRepository
}

func NewAvailableOverrideService(repo *AvailableOverrideRepository) *AvailableOverrideService {
	return &AvailableOverrideService{repo}
}

func (service *AvailableOverrideService) FindAll() ([]entities.AvailableOverride, error) {
	return service.repo.FindAll()
}

func (service *AvailableOverrideService) FindByID(id uuid.UUID) (*entities.AvailableOverride, error) {
	return service.repo.FindByID(id)
}

func (service *AvailableOverrideService) Create(availableOverride *entities.AvailableOverride) error {
	return service.repo.Create(availableOverride)
}

func (service *AvailableOverrideService) Update(availableOverride *entities.AvailableOverride) error {
	return service.repo.Update(availableOverride)
}

func (service *AvailableOverrideService) DeleteUntilNow() error {
	return service.repo.DeleteUntilNow()
}

func (service *AvailableOverrideService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
