package bus_reservation

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
)

type BusReservationService struct {
	repo        *BusReservationRepository
	userRepo    *user.UserRepository
	busTripRepo *bus_trip.BusTripRepository
}

func NewBusReservationService(repo *BusReservationRepository, userRepo *user.UserRepository, busTripRepo *bus_trip.BusTripRepository) *BusReservationService {
	return &BusReservationService{repo, userRepo, busTripRepo}
}

func (service *BusReservationService) FindAll() ([]entities.BusReservation, error) {
	return service.repo.FindAll()
}

func (service *BusReservationService) FindByDate(date time.Time) ([]entities.BusReservation, error) {
	return service.repo.FindByDate(date)
}

func (service *BusReservationService) FindByUserID(userID uuid.UUID) ([]entities.BusReservation, error) {
	return service.repo.FindByUserID(userID)
}

func (service *BusReservationService) FindByID(id uuid.UUID) (*entities.BusReservation, error) {
	return service.repo.FindByID(id)
}

func (service *BusReservationService) Create(busReservation *entities.BusReservation) error {
	userExists, err := service.userRepo.FindByID(busReservation.UserID)
	if err != nil {
		return err
	}
	if userExists == nil {
		return errors.New("user not found")
	}

	busReservationExists, err := service.repo.FindByUserIDAndDateAndPeriod(busReservation.UserID, busReservation.Date, busReservation.Period)
	if err != nil {
		return err
	}
	if busReservationExists != nil {
		return errors.New("bus reservation already exists")
	}

	busTripExists, err := service.busTripRepo.FindByID(busReservation.BusTripID)
	if err != nil {
		return err
	}
	if busTripExists == nil {
		return errors.New("bus trip not found")
	}

	return service.repo.Create(busReservation)
}

func (service *BusReservationService) Update(busReservation *entities.BusReservation) error {
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

	return service.repo.Update(busReservation)
}

func (service *BusReservationService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
