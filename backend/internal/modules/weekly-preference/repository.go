package weekly_preference

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WeeklyPreferenceRepository struct {
	db *gorm.DB
}

func NewWeeklyPreferenceRepository(db *gorm.DB) *WeeklyPreferenceRepository {
	return &WeeklyPreferenceRepository{db}
}

func (repo *WeeklyPreferenceRepository) FindByUserID(userID uuid.UUID) (*WeeklyPreference, error) {
	var weeklyPreference WeeklyPreference
	err := repo.db.Where("user_id = ?", userID).First(&weeklyPreference).Error
	return &weeklyPreference, err
}

func (repo *WeeklyPreferenceRepository) Create(weeklyPreference *WeeklyPreference) error {
	return repo.db.Create(weeklyPreference).Error
}

func (repo *WeeklyPreferenceRepository) Update(weeklyPreference *WeeklyPreference) error {
	return repo.db.Where("id = ?", weeklyPreference.ID).Save(weeklyPreference).Error
}

func (repo *WeeklyPreferenceRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&WeeklyPreference{}).Error
}
