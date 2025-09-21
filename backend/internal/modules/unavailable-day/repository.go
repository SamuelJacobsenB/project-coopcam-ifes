package unavailable_day

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UnavailableDayRepository struct {
	db *gorm.DB
}

func NewUnavailableDayRepository(db *gorm.DB) *UnavailableDayRepository {
	return &UnavailableDayRepository{db}
}

func (repo *UnavailableDayRepository) FindAll() ([]entities.UnavailableDay, error) {
	var unavailableDays []entities.UnavailableDay
	err := repo.db.Find(&unavailableDays).Error
	return unavailableDays, err
}

func (repo *UnavailableDayRepository) FindByID(id uuid.UUID) (*entities.UnavailableDay, error) {
	var unavailableDay entities.UnavailableDay
	err := repo.db.First(&unavailableDay, id).Error
	return &unavailableDay, err
}

func (repo *UnavailableDayRepository) OtherEventExists(date time.Time) (bool, error) {
	var unavailableDay entities.UnavailableDay
	err1 := repo.db.Where("DATE(date) = ?", date.Format("2006-01-02")).First(&unavailableDay).Error

	var availableOverride entities.AvailableOverride
	err2 := repo.db.Where("DATE(date) = ?", date.Format("2006-01-02")).First(&availableOverride).Error

	if err1 != nil && !errors.Is(err1, gorm.ErrRecordNotFound) {
		return false, err1
	}
	if err2 != nil && !errors.Is(err2, gorm.ErrRecordNotFound) {
		return false, err2
	}

	return unavailableDay.ID != uuid.Nil || availableOverride.ID != uuid.Nil, nil
}

func (repo *UnavailableDayRepository) Create(unavailableDay *entities.UnavailableDay) error {
	unavailableDay.ID = uuid.New()
	return repo.db.Create(unavailableDay).Error
}

func (repo *UnavailableDayRepository) Update(unavailableDay *entities.UnavailableDay) error {
	return repo.db.Model(&entities.UnavailableDay{}).Where("id = ?", unavailableDay.ID).Updates(unavailableDay).Error
}

func (repo *UnavailableDayRepository) DeleteUntilNow() error {
	return repo.db.Where("date < ?", time.Now()).Delete(&entities.UnavailableDay{}).Error
}

func (repo *UnavailableDayRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.UnavailableDay{}).Error
}
