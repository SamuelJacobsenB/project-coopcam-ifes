package template

import (
	"errors"

	"gorm.io/gorm"
	"github.com/lib/pq"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
)

type TemplateService struct {
	repo     *TemplateRepository
	userRepo *user.UserRepository
}

func NewTemplateService(repo *TemplateRepository, userRepo *user.UserRepository) *TemplateService {
	return &TemplateService{repo, userRepo}
}

func (service *TemplateService) FindByUserID(userID uuid.UUID) (*entities.Template, error) {
	template, err := service.repo.FindByUserID(userID)
	if err != nil {
		return nil, errors.New("template not found")
	}

	return template, nil
}

func (service *TemplateService) Create(template *entities.Template) error {
	user, err := service.userRepo.FindByID(template.UserID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	existing, err := service.repo.FindByUserID(template.UserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			existing = nil
		} else {
			return err
		}
	}
	if existing != nil {
		return errors.New("template already exists")
	}

	return service.repo.Create(template)
}

func (service *TemplateService) Update(template *entities.Template) error {
	if template.GoSchedule.MorningDays == nil {
		template.GoSchedule.MorningDays = pq.Int64Array{}
	}
	if template.GoSchedule.AfternoonDays == nil {
		template.GoSchedule.AfternoonDays = pq.Int64Array{}
	}
	if template.ReturnSchedule.MorningDays == nil {
		template.ReturnSchedule.MorningDays = pq.Int64Array{}
	}
	if template.ReturnSchedule.AfternoonDays == nil {
		template.ReturnSchedule.AfternoonDays = pq.Int64Array{}
	}

	return service.repo.Update(template)
}

func (service *TemplateService) DeleteByUserID(id uuid.UUID) error {
	return service.repo.DeleteByUserID(id)
}
