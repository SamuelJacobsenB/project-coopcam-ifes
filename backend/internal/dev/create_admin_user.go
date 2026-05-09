package dev

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/security"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateAdminUser(db *gorm.DB) {
	var user entities.User
	err := db.Where("email = ?", "admin@email.com").First(&user).Error
	if err == nil {
		return
	}

	hashedPassword, err := security.HashPassword("Admin#123")
	if err != nil {
		panic(err)
	}

	err = db.Create(&entities.User{
		ID:              uuid.New(),
		Name:            "Admin",
		Email:           "admin@email.com",
		Password:        hashedPassword,
		CPF:             "12312312312",
		Phone:           "27000000000",
		Address:         "Admin Address",
		CEP:             "00000000",
		Birth:           time.Date(2000, time.January, 25, 0, 0, 0, 0, time.UTC),
		HasFinancialAid: true,
		Role:            "admin",
	}).Error
	if err != nil {
		panic(errors.New("Failed to create admin user: " + err.Error()))
	}
}
