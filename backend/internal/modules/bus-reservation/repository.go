package bus_reservation

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusReservationRepository struct {
	db *gorm.DB
}

func NewBusReservationRepository(db *gorm.DB) *BusReservationRepository {
	return &BusReservationRepository{db}
}

func (repo *BusReservationRepository) FindAll() ([]BusReservation, error) {
	var busReservations []BusReservation
	err := repo.db.Find(&busReservations).Error
	return busReservations, err
}

func (repo *BusReservationRepository) FindByUserID(userID uuid.UUID) ([]BusReservation, error) {
	var busReservations []BusReservation
	err := repo.db.Where("user_id = ?", userID).Find(&busReservations).Error
	return busReservations, err
}

func (repo *BusReservationRepository) FindByID(id uuid.UUID) (*BusReservation, error) {
	var busReservation BusReservation
	err := repo.db.First(&busReservation, id).Error
	return &busReservation, err
}

func (repo *BusReservationRepository) Create(busReservation *BusReservation) error {
	return repo.db.Create(busReservation).Error
}

func (repo *BusReservationRepository) Update(busReservation *BusReservation) error {
	return repo.db.Where("id = ?", busReservation.ID).Save(busReservation).Error
}

func (repo *BusReservationRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&BusReservation{}).Error
}
