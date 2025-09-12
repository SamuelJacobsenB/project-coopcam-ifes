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
	return service.repo.FindByUserID(userID)
}

func (service *WeeklyPreferenceService) Create(weeklyPreference *entities.WeeklyPreference) error {
	userExists, err := service.userRepo.FindByID(weeklyPreference.UserID)
	if err != nil {
		return err
	}
	if userExists == nil {
		return errors.New("user not found")
	}

	weeklyPreferenceExists, err := service.repo.FindByUserID(weeklyPreference.UserID)
	if err != nil {
		return err
	}
	if weeklyPreferenceExists != nil {
		return errors.New("weekly preference already exists")
	}

	return service.repo.Create(weeklyPreference)
}

func (service *WeeklyPreferenceService) Update(weeklyPreference *entities.WeeklyPreference) error {
	return service.repo.Update(weeklyPreference)
}

func (service *WeeklyPreferenceService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}

