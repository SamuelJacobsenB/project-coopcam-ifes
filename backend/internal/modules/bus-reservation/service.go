package bus_reservation

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/user"
	"github.com/google/uuid"
)

type BusReservationService struct {
	repo     *BusReservationRepository
	userRepo *user.UserRepository
}

func NewBusReservationService(repo *BusReservationRepository, userRepo *user.UserRepository) *BusReservationService {
	return &BusReservationService{repo, userRepo}
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

	if busReservation.Attended != busRes.Attended {
		busRes.Attended = busReservation.Attended
	}

	return service.repo.Update(busReservation)
}

func (service *BusReservationService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
