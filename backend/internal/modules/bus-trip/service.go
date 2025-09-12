package bus_trip

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
)

type BusTripService struct {
	repo *BusTripRepository
}

func NewBusTripService(repo *BusTripRepository) *BusTripService {
	return &BusTripService{repo}
}

func (service *BusTripService) FindAll() ([]entities.BusTrip, error) {
	return service.repo.FindAll()
}

func (service *BusTripService) FindByDate(date time.Time) ([]entities.BusTrip, error) {
	return service.repo.FindByDate(date)
}

func (service *BusTripService) FindByNextDate(date time.Time) ([]entities.BusTrip, error) {
	return service.repo.FindByNextDate(date)
}

func (service *BusTripService) FindByID(id uuid.UUID) (*entities.BusTrip, error) {
	return service.repo.FindByID(id)
}

func (service *BusTripService) Create(busTrip *entities.BusTrip) error {
	return service.repo.Create(busTrip)
}

func (service *BusTripService) Update(busTrip *entities.BusTrip) error {
	return service.repo.Update(busTrip)
}

func (service *BusTripService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}

