package available_override

import (
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

func (repo *AvailableOverrideRepository) Create(availableOverride *entities.AvailableOverride) error {
	availableOverride.ID = uuid.New()
	return repo.db.Create(availableOverride).Error
}

func (repo *AvailableOverrideRepository) Update(availableOverride *entities.AvailableOverride) error {
	return repo.db.Where("id = ?", availableOverride.ID).Save(availableOverride).Error
}

func (repo *AvailableOverrideRepository) DeleteUntilNow() error {
	return repo.db.Where("date < ?", time.Now()).Delete(&entities.AvailableOverride{}).Error
}

func (repo *AvailableOverrideRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.AvailableOverride{}).Error
}
