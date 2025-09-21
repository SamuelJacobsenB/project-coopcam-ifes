package available_override

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AvailableOverrideRepository struct {
	db *gorm.DB
}

func NewAvailableOverrideRepository(db *gorm.DB) *AvailableOverrideRepository {
	return &AvailableOverrideRepository{db}
}

func (repo *AvailableOverrideRepository) FindAll() ([]entities.AvailableOverride, error) {
	var availableOverrides []entities.AvailableOverride
	err := repo.db.Find(&availableOverrides).Error
	return availableOverrides, err
}

func (repo *AvailableOverrideRepository) FindByID(id uuid.UUID) (*entities.AvailableOverride, error) {
	var availableOverride entities.AvailableOverride
	err := repo.db.First(&availableOverride, id).Error
	return &availableOverride, err
}

func (repo *AvailableOverrideRepository) OtherEventExists(date time.Time) (bool, error) {
	var availableOverride entities.AvailableOverride
	err1 := repo.db.Where("DATE(date) = ?", date.Format("2006-01-02")).First(&availableOverride).Error

	var unavailableDay entities.UnavailableDay
	err2 := repo.db.Where("DATE(date) = ?", date.Format("2006-01-02")).First(&unavailableDay).Error

	if err1 != nil && !errors.Is(err1, gorm.ErrRecordNotFound) {
		return false, err1
	}
	if err2 != nil && !errors.Is(err2, gorm.ErrRecordNotFound) {
		return false, err2
	}

	return unavailableDay.ID != uuid.Nil || availableOverride.ID != uuid.Nil, nil
}

func (repo *AvailableOverrideRepository) Create(availableOverride *entities.AvailableOverride) error {
	availableOverride.ID = uuid.New()
	return repo.db.Create(availableOverride).Error
}

func (repo *AvailableOverrideRepository) Update(availableOverride *entities.AvailableOverride) error {
	return repo.db.Model(&entities.AvailableOverride{}).Where("id = ?", availableOverride.ID).Updates(availableOverride).Error
}

func (repo *AvailableOverrideRepository) DeleteUntilNow() error {
	return repo.db.Where("date < ?", time.Now()).Delete(&entities.AvailableOverride{}).Error
}

func (repo *AvailableOverrideRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.AvailableOverride{}).Error
}
