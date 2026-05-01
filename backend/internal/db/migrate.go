package db

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/audit"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
)

func MigrateDB() error {
	return DB.AutoMigrate(&entities.User{}, &entities.WeeklyPreference{}, &entities.Template{}, &entities.MonthlyFeeConfig{}, &entities.MonthlyPayment{}, &entities.BusReservation{}, &entities.BusTripReport{}, &entities.AvailableOverride{}, &entities.UnavailableDay{}, &audit.AuditEvent{})
}
