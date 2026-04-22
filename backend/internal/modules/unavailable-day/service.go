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

func (service *UnavailableDayService) Create(unavailableDay *entities.UnavailableDay) error {
	normalizedDate := time.Date(unavailableDay.Date.Year(), unavailableDay.Date.Month(), unavailableDay.Date.Day(), 0, 0, 0, 0, time.Local)
	unavailableDay.Date = normalizedDate

	exists, err := service.repo.OtherEventExists(normalizedDate)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("já existe um evento agendado para esta data")
	}

	return service.repo.Create(unavailableDay)
}

func (service *UnavailableDayService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
