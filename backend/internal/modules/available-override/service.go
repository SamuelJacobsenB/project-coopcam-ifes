package available_override

import "github.com/google/uuid"

type AvailableOverrideService struct {
	repo *AvailableOverrideRepository
}

func NewAvailableOverrideService(repo *AvailableOverrideRepository) *AvailableOverrideService {
	return &AvailableOverrideService{repo}
}

func (service *AvailableOverrideService) FindAll() ([]AvailableOverride, error) {
	return service.repo.FindAll()
}

func (service *AvailableOverrideService) FindByID(id uuid.UUID) (*AvailableOverride, error) {
	return service.repo.FindByID(id)
}

func (service *AvailableOverrideService) Create(availableOverride *AvailableOverride) error {
	return service.repo.Create(availableOverride)
}

func (service *AvailableOverrideService) Update(availableOverride *AvailableOverride) error {
	return service.repo.Update(availableOverride)
}

func (service *AvailableOverrideService) DeleteUntilNow() error {
	return service.repo.DeleteUntilNow()
}

func (service *AvailableOverrideService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
