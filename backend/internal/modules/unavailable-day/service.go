package unavailable_day

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
)

type UnavailableDayService struct {
	repo *UnavailableDayRepository
}

func NewUnavailableDayService(repo *UnavailableDayRepository) *UnavailableDayService {
	return &UnavailableDayService{repo}
}

func (service *UnavailableDayService) FindAll() ([]entities.UnavailableDay, error) {
	return service.repo.FindAll()
}

func (service *UnavailableDayService) FindByID(id uuid.UUID) (*entities.UnavailableDay, error) {
	return service.repo.FindByID(id)
}

func (service *UnavailableDayService) Create(unavailableDay *entities.UnavailableDay) error {
	ifExists, err := service.repo.OtherEventExists(unavailableDay.Date)
	if err != nil {
		return err
	}
	if ifExists {
		return errors.New("já existe um evento agendado para essa data")
	}

	unavailableDay.Date = time.Date(unavailableDay.Date.Year(), unavailableDay.Date.Month(), unavailableDay.Date.Day(), 12, 0, 0, 0, time.Local)

	return service.repo.Create(unavailableDay)
}

func (service *UnavailableDayService) Update(unavailableDay *entities.UnavailableDay) error {
	return service.repo.Update(unavailableDay)
}

func (service *UnavailableDayService) DeleteUntilNow() error {
	return service.repo.DeleteUntilNow()
}

func (service *UnavailableDayService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
