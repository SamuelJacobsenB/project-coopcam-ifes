package template

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
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
	return repo.db.Create(template).Error
}

func (repo *TemplateRepository) Update(template *entities.Template) error {
	return repo.db.Save(template).Error
}

func (repo *TemplateRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.Template{}).Error
}
