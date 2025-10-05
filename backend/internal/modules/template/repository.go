package template

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TemplateRepository struct {
	db *gorm.DB
}

func NewTemplateRepository(db *gorm.DB) *TemplateRepository {
	return &TemplateRepository{db}
}

func (repo *TemplateRepository) FindByUserID(userID uuid.UUID) (*entities.Template, error) {
	var template entities.Template
	err := repo.db.Where("user_id = ?", userID).First(&template).Error
	return &template, err
}

func (repo *TemplateRepository) Create(template *entities.Template) error {
	template.ID = uuid.New()
	return repo.db.Create(template).Error
}

func (repo *TemplateRepository) Update(template *entities.Template) error {
	return repo.db.Model(template).Where("user_id = ?", template.UserID).Updates(map[string]interface{}{
			"go_morning_days":     template.GoSchedule.MorningDays,
			"go_afternoon_days":   template.GoSchedule.AfternoonDays,
			"return_morning_days": template.ReturnSchedule.MorningDays,
			"return_afternoon_days": template.ReturnSchedule.AfternoonDays,
		}).Error
}

func (repo *TemplateRepository) DeleteByUserID(id uuid.UUID) error {
	return repo.db.Where("user_id = ?", id).Delete(&entities.Template{}).Error
}
