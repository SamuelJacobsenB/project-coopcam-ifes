package unavailable_day

import "github.com/google/uuid"

type UnavailableDayService struct {
	repo *UnavailableDayRepository
}

func NewUnavailableDayService(repo *UnavailableDayRepository) *UnavailableDayService {
	return &UnavailableDayService{repo}
}

func (service *UnavailableDayService) FindAll() ([]UnavailableDay, error) {
	return service.repo.FindAll()
}

func (service *UnavailableDayService) FindByID(id uuid.UUID) (*UnavailableDay, error) {
	return service.repo.FindByID(id)
}

func (service *UnavailableDayService) Create(unavailableDay *UnavailableDay) error {
	return service.repo.Create(unavailableDay)
}

func (service *UnavailableDayService) Update(unavailableDay *UnavailableDay) error {
	return service.repo.Update(unavailableDay)
}

func (service *UnavailableDayService) DeleteUntilNow() error {
	return service.repo.DeleteUntilNow()
}

func (service *UnavailableDayService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
