package monthly_fee_config

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyFeeConfigRepository struct {
	db *gorm.DB
}

func NewMonthlyFeeConfigRepository(db *gorm.DB) *MonthlyFeeConfigRepository {
	return &MonthlyFeeConfigRepository{db}
}

func (repo *MonthlyFeeConfigRepository) FindByID(id uuid.UUID) (*entities.MonthlyFeeConfig, error) {
	var config entities.MonthlyFeeConfig
	err := repo.db.First(&config, "id = ?", id).Error
	return &config, err
}

func (repo *MonthlyFeeConfigRepository) FindByYear(year int) ([]entities.MonthlyFeeConfig, error) {
	var configs []entities.MonthlyFeeConfig
	err := repo.db.Where("year = ?", year).Order("month asc").Find(&configs).Error
	return configs, err
}

func (repo *MonthlyFeeConfigRepository) Create(config *entities.MonthlyFeeConfig) error {
	config.ID = uuid.New()
	return repo.db.Create(config).Error
}

func (repo *MonthlyFeeConfigRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.MonthlyFeeConfig{}).Error
}
