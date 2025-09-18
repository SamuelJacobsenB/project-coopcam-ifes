package unavailable_day

import (
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

func (repo *UnavailableDayRepository) Create(unavailableDay *entities.UnavailableDay) error {
	unavailableDay.ID = uuid.New()
	return repo.db.Create(unavailableDay).Error
}

func (repo *UnavailableDayRepository) Update(unavailableDay *entities.UnavailableDay) error {
	return repo.db.Where("id = ?", unavailableDay.ID).Save(unavailableDay).Error
}

func (repo *UnavailableDayRepository) DeleteUntilNow() error {
	return repo.db.Where("date < ?", time.Now()).Delete(&entities.UnavailableDay{}).Error
}

func (repo *UnavailableDayRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.UnavailableDay{}).Error
}
