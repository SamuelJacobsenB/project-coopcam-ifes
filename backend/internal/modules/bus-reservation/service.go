package bus_reservation

import "github.com/google/uuid"

type BusReservationService struct {
	repo *BusReservationRepository
}

func NewBusReservationService(repo *BusReservationRepository) *BusReservationService {
	return &BusReservationService{repo}
}

func (service *BusReservationService) FindAll() ([]BusReservation, error) {
	return service.repo.FindAll()
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
	return service.repo.Update(busReservation)
}

func (service *BusReservationService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
