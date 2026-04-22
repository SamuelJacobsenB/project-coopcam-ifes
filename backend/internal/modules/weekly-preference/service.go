package weekly_preference

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
)

type WeeklyPreferenceService struct {
	repo     *WeeklyPreferenceRepository
	userRepo *user.UserRepository
}

func NewWeeklyPreferenceService(repo *WeeklyPreferenceRepository, userRepo *user.UserRepository) *WeeklyPreferenceService {
	return &WeeklyPreferenceService{repo, userRepo}
}

func (service *WeeklyPreferenceService) FindByUserID(userID uuid.UUID) (*entities.WeeklyPreference, error) {
	weeklyPreference, err := service.repo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("weekly preference not found")
	}

	return weeklyPreference, nil
}
