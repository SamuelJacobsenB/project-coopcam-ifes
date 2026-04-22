package weekly_preference

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WeeklyPreferenceRepository struct {
	db *gorm.DB
}

func NewWeeklyPreferenceRepository(db *gorm.DB) *WeeklyPreferenceRepository {
	return &WeeklyPreferenceRepository{db}
}

func (repo *WeeklyPreferenceRepository) FindByUserID(userID uuid.UUID) (*entities.WeeklyPreference, error) {
	var weeklyPreference entities.WeeklyPreference
	err := repo.db.Where("user_id = ?", userID).Preload("Overrides").First(&weeklyPreference).Error
	return &weeklyPreference, err
}
