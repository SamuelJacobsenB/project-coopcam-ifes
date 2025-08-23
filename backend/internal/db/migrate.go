package db

import (
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/available-override"
	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/bus-reservation"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/bus-trip-report"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/template"
	unavailable_day "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/unavailable-day"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/user"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/weekly-preference"
)

func MigrateDB() {
	err := DB.AutoMigrate(&user.User{}, &weekly_preference.WeeklyPreference{}, &template.Template{}, &bus_reservation.BusReservation{}, &bus_trip_report.BusTripReport{}, &available_override.AvailableOverride{}, &unavailable_day.UnavailableDay{})

	if err != nil {
		panic("Falha na migração do banco de dados: " + err.Error())
	}
}
