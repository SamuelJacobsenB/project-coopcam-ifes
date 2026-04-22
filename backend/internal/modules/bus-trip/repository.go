package bus_trip

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusTripRepository struct {
	db *gorm.DB
}

func NewBusTripRepository(db *gorm.DB) *BusTripRepository {
	return &BusTripRepository{db}
}

func (repo *BusTripRepository) FindByDate(date time.Time) ([]entities.BusTrip, error) {
	var busTrips []entities.BusTrip
	err := repo.db.Where("DATE(date) = ?", date).Find(&busTrips).Error
	return busTrips, err
}

func (repo *BusTripRepository) FindByDateAndPeriodAndDirection(date time.Time, period types.Period, direction types.Direction) (*entities.BusTrip, error) {
	var busTrip entities.BusTrip
	err := repo.db.Where("DATE(date) = ? AND period = ? AND direction = ?", date, period, direction).First(&busTrip).Error
	return &busTrip, err
}

func (repo *BusTripRepository) FindByID(id uuid.UUID) (*entities.BusTrip, error) {
	var busTrip entities.BusTrip
	err := repo.db.Where("id = ?", id).First(&busTrip).Error
	return &busTrip, err
}

func (repo *BusTripRepository) Update(busTrip *entities.BusTrip) error {
	return repo.db.Model(&entities.BusTrip{}).Where("id = ?", busTrip.ID).Updates(busTrip).Error
}
