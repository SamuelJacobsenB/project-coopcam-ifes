package db

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
)

func MigrateDB() {
	err := DB.AutoMigrate(&entities.User{}, &entities.WeeklyPreference{}, &entities.Template{}, &entities.BusReservation{}, &entities.BusTripReport{}, &entities.AvailableOverride{}, &entities.UnavailableDay{})

	if err != nil {
		panic("Falha na migração do banco de dados: " + err.Error())
	}
}
