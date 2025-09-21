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

func (repo *BusTripRepository) FindAll() ([]entities.BusTrip, error) {
	var busTrips []entities.BusTrip
	err := repo.db.Find(&busTrips).Error
	return busTrips, err
}

func (repo *BusTripRepository) FindByDate(date time.Time) ([]entities.BusTrip, error) {
	var busTrips []entities.BusTrip
	err := repo.db.Where("DATE(date) = ?", date).Find(&busTrips).Error
	return busTrips, err
}

func (repo *BusTripRepository) FindByNextDate(date time.Time) ([]entities.BusTrip, error) {
	var busTrips []entities.BusTrip
	err := repo.db.Where("DATE(date) >= ?", date).Find(&busTrips).Error
	return busTrips, err
}

func (repo *BusTripRepository) FindByID(id uuid.UUID) (*entities.BusTrip, error) {
	var busTrip entities.BusTrip
	err := repo.db.Where("id = ?", id).First(&busTrip).Error
	return &busTrip, err
}

func (repo *BusTripRepository) Create(busTrip *entities.BusTrip) error {
	busTrip.Status = types.Unstarted
	busTrip.ID = uuid.New()
	return repo.db.Create(busTrip).Error
}

func (repo *BusTripRepository) Update(busTrip *entities.BusTrip) error {
	return repo.db.Model(&entities.BusTrip{}).Where("id = ?", busTrip.ID).Updates(busTrip).Error
}

func (repo *BusTripRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.BusTrip{}).Error
}
