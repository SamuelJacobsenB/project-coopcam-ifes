package bus_reservation

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusReservationRepository struct {
	db *gorm.DB
}

func NewBusReservationRepository(db *gorm.DB) *BusReservationRepository {
	return &BusReservationRepository{db}
}

func (repo *BusReservationRepository) FindAll() ([]entities.BusReservation, error) {
	var busReservations []entities.BusReservation
	err := repo.db.Find(&busReservations).Error
	return busReservations, err
}

func (repo *BusReservationRepository) FindByDate(date time.Time) ([]entities.BusReservation, error) {
	var busReservations []entities.BusReservation
	err := repo.db.Where("date = ?", date).Find(&busReservations).Error
	return busReservations, err
}

func (repo *BusReservationRepository) FindByUserIDAndDateAndPeriodAndDirection(userID uuid.UUID, date time.Time, period types.Period, direction types.Direction) (*entities.BusReservation, error) {
	var busReservations entities.BusReservation
	err := repo.db.Where("user_id = ? AND date = ? AND period = ? AND direction = ?", userID, date, period, direction).First(&busReservations).Error
	return &busReservations, err
}

func (repo *BusReservationRepository) FindByID(id uuid.UUID) (*entities.BusReservation, error) {
	var busReservation entities.BusReservation
	err := repo.db.First(&busReservation, id).Error
	return &busReservation, err
}

func (repo *BusReservationRepository) FindByTripID(tripID uuid.UUID) ([]entities.BusReservation, error) {
	var busReservations []entities.BusReservation
	err := repo.db.Where("bus_trip_id = ?", tripID).Find(&busReservations).Error
	return busReservations, err
}

func (repo *BusReservationRepository) Create(busReservation *entities.BusReservation) error {
	busReservation.ID = uuid.New()
	return repo.db.Create(busReservation).Error
}

func (repo *BusReservationRepository) DeleteUntilNow() error {
	return repo.db.Where("date < ?", time.Now()).Delete(&entities.BusReservation{}).Error
}

func (repo *BusReservationRepository) Delete(id uuid.UUID, userID uuid.UUID) error {
	return repo.db.Where("id = ? AND user_id = ?", id, userID).Delete(&entities.BusReservation{}).Error // repo.db.Where("id = ?", id).Delete(&entities.BusReservation{}).Error
}
