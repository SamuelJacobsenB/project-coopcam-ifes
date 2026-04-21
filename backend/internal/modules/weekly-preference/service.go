package weekly_preference

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
	"gorm.io/gorm"
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

func (service *WeeklyPreferenceService) Create(weeklyPreference *entities.WeeklyPreference) error {
	userExists, err := service.userRepo.FindByID(weeklyPreference.UserID)
	if err != nil || userExists == nil {
		return errors.New("usuário não encontrado")
	}

	existing, err := service.repo.FindByUserID(weeklyPreference.UserID)
	if err == nil && existing != nil {
		return errors.New("preferência semanal já cadastrada para este usuário")
	}

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	return service.repo.Create(weeklyPreference)
}

func (service *WeeklyPreferenceService) Update(weeklyPreference *entities.WeeklyPreference) error {
	return service.repo.Update(weeklyPreference)
}

func (service *WeeklyPreferenceService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
