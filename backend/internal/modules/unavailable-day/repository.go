package unavailable_day

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UnavailableDayRepository struct {
	db *gorm.DB
}

func NewUnavailableDayRepository(db *gorm.DB) *UnavailableDayRepository {
	return &UnavailableDayRepository{db}
}

func (repo *UnavailableDayRepository) FindAll() ([]UnavailableDay, error) {
	var unavailableDays []UnavailableDay
	err := repo.db.Find(&unavailableDays).Error
	return unavailableDays, err
}

func (repo *UnavailableDayRepository) FindByID(id uuid.UUID) (*UnavailableDay, error) {
	var unavailableDay UnavailableDay
	err := repo.db.First(&unavailableDay, id).Error
	return &unavailableDay, err
}

func (repo *UnavailableDayRepository) Create(unavailableDay *UnavailableDay) error {
	return repo.db.Create(unavailableDay).Error
}

func (repo *UnavailableDayRepository) Update(unavailableDay *UnavailableDay) error {
	return repo.db.Where("id = ?", unavailableDay.ID).Save(unavailableDay).Error
}

func (repo *UnavailableDayRepository) DeleteUntilNow() error {
	return repo.db.Where("date < ?", time.Now()).Delete(&UnavailableDay{}).Error
}

func (repo *UnavailableDayRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&UnavailableDay{}).Error
}
