package bus_reservation

import (
	"time"

	"github.com/google/uuid"
)

type BusReservationService struct {
	repo *BusReservationRepository
}

func NewBusReservationService(repo *BusReservationRepository) *BusReservationService {
	return &BusReservationService{repo}
}

func (service *BusReservationService) FindAll() ([]BusReservation, error) {
	return service.repo.FindAll()
}

func (service *BusReservationService) FindByDate(date time.Time) ([]BusReservation, error) {
	return service.repo.FindByDate(date)
}

func (service *BusReservationService) FindByUserID(userID uuid.UUID) ([]BusReservation, error) {
	return service.repo.FindByUserID(userID)
}

func (service *BusReservationService) FindByID(id uuid.UUID) (*BusReservation, error) {
	return service.repo.FindByID(id)
}

// add validation if user exists
func (service *BusReservationService) Create(busReservation *BusReservation) error {
	return service.repo.Create(busReservation)
}

func (service *BusReservationService) Update(busReservation *BusReservation) error {
	busRes, err := service.repo.FindByID(busReservation.ID)
	if err != nil {
		return err
	}

	if busReservation.Date.IsZero() || busReservation.Date.Equal(busRes.Date) {
		busReservation.Date = busRes.Date
	}

	if busReservation.Period == "" || busReservation.Period == busRes.Period {
		busRes.Period = busReservation.Period
	}

	if busReservation.Attended != busRes.Attended {
		busRes.Attended = busReservation.Attended
	}

	return service.repo.Update(busReservation)
}

func (service *BusReservationService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
