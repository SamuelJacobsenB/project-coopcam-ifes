package weekly_preference

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/google/uuid"
)

type WeeklyPreferenceService struct {
	repo *WeeklyPreferenceRepository
}

func NewWeeklyPreferenceService(repo *WeeklyPreferenceRepository) *WeeklyPreferenceService {
	return &WeeklyPreferenceService{repo}
}

func (service *WeeklyPreferenceService) FindByUserID(userID uuid.UUID) (*entities.WeeklyPreference, error) {
	return service.repo.FindByUserID(userID)
}

// Verify if user exists
// Verify if weeklypreference exists
func (service *WeeklyPreferenceService) Create(weeklyPreference *entities.WeeklyPreference) error {
	return service.repo.Create(weeklyPreference)
}

func (service *WeeklyPreferenceService) Update(weeklyPreference *entities.WeeklyPreference) error {
	return service.repo.Update(weeklyPreference)
}

func (service *WeeklyPreferenceService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
