package bus_reservation

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusReservationService struct {
	repo        *BusReservationRepository
	userRepo    *user.UserRepository
	busTripRepo *bus_trip.BusTripRepository
}

func NewBusReservationService(repo *BusReservationRepository, userRepo *user.UserRepository, busTripRepo *bus_trip.BusTripRepository) *BusReservationService {
	return &BusReservationService{repo, userRepo, busTripRepo}
}

func (service *BusReservationService) FindByDate(date time.Time) ([]entities.BusReservation, error) {
	return service.repo.FindByDate(date)
}

func (service *BusReservationService) FindByTripID(tripID uuid.UUID) ([]entities.BusReservation, error) {
	return service.repo.FindByTripID(tripID)
}

func (service *BusReservationService) Create(busReservation *entities.BusReservation) error {
	userExists, err := service.userRepo.FindByID(busReservation.UserID)
	if err != nil {
		return err
	}
	if userExists == nil {
		return errors.New("user not found")
	}

	busReservationExists, err := service.repo.FindByUserIDAndDateAndPeriodAndDirection(busReservation.UserID, busReservation.Date, busReservation.Period, busReservation.Direction)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if busReservationExists != nil && busReservationExists.ID != uuid.Nil {
		return errors.New("uma reserva já existe para este período")
	}

	busTripExists, err := service.busTripRepo.FindByDateAndPeriodAndDirection(busReservation.Date, busReservation.Period, busReservation.Direction)
	if err != nil {
		return err
	}
	if busTripExists == nil {
		return errors.New("bus trip not found")
	}

	if !VerifyValidityOfReservation(busReservation.Date, busReservation.Period, busReservation.Direction) {
		return errors.New("reserva fora da validade")
	}

	busReservation.BusTripID = busTripExists.ID

	return service.repo.Create(busReservation)
}

func (service *BusReservationService) Delete(id uuid.UUID, userID uuid.UUID) error {
	reservationExists, err := service.repo.FindByID(id)
	if err != nil {
		return err
	}
	if reservationExists == nil {
		return errors.New("reservation not found")
	}

	if reservationExists.UserID != userID {
		return errors.New("user not authorized")
	}

	if !VerifyValidityOfReservation(reservationExists.Date, reservationExists.Period, reservationExists.Direction) {
		return errors.New("reserva fora da validade")
	}

	return service.repo.Delete(id, userID)
}

func VerifyValidityOfReservation(date time.Time, period types.Period, direction types.Direction) bool {
	loc, err := time.LoadLocation("America/Sao_Paulo")
	if err != nil {
		return false
	}

	date = date.In(loc)

	var hour, min int

	switch {
	case period == "morning" && direction == "go":
		hour, min = 3, 0
	case period == "morning" && direction == "return":
		hour, min = 10, 20
	case period == "afternoon" && direction == "go":
		hour, min = 9, 0
	case period == "afternoon" && direction == "return":
		hour, min = 16, 20
	}

	maxValidityTime := time.Date(date.Year(), date.Month(), date.Day(), hour, min, 0, 0, loc)
	return time.Now().In(loc).Before(maxValidityTime)
}
