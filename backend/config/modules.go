package config

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/auth"
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/available-override"
	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-reservation"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip-report"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/template"
	unavailable_day "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/unavailable-day"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/weekly-preference"
	"gorm.io/gorm"
)

type ModuleHandlers struct {
	AuthHandler              *auth.AuthHandler
	UserHandler              *user.UserHandler
	WeeklyPreferenceHandler  *weekly_preference.WeeklyPreferenceHandler
	TemplateHandler          *template.TemplateHandler
	BusReservationHandler    *bus_reservation.BusReservationHandler
	BusTripHandler           *bus_trip.BusTripHandler
	BusTripReportHandler     *bus_trip_report.BusTripReportHandler
	AvailableOverrideHandler *available_override.AvailableOverrideHandler
	UnavailableDayHandler    *unavailable_day.UnavailableDayHandler
}

func SetupModules(db *gorm.DB) *ModuleHandlers {
	userRepo := user.NewUserRepository(db)
	weeklyPreferenceRepo := weekly_preference.NewWeeklyPreferenceRepository(db)
	templateRepo := template.NewTemplateRepository(db)
	busReservationRepo := bus_reservation.NewBusReservationRepository(db)
	busTripRepo := bus_trip.NewBusTripRepository(db)
	busTripReportRepo := bus_trip_report.NewBusTripReportRepository(db)
	availableOverrideRepo := available_override.NewAvailableOverrideRepository(db)
	unavailableDayRepo := unavailable_day.NewUnavailableDayRepository(db)

	authService := auth.NewAuthService(userRepo)
	userService := user.NewUserService(userRepo)
	weeklyPreferenceService := weekly_preference.NewWeeklyPreferenceService(weeklyPreferenceRepo, userRepo)
	templateService := template.NewTemplateService(templateRepo, userRepo)
	busReservationService := bus_reservation.NewBusReservationService(busReservationRepo, userRepo, busTripRepo)
	busTripReportService := bus_trip_report.NewBusTripReportService(busTripReportRepo, userRepo)
	busTripService := bus_trip.NewBusTripService(busTripRepo)
	availableOverrideService := available_override.NewAvailableOverrideService(availableOverrideRepo)
	unavailableDayService := unavailable_day.NewUnavailableDayService(unavailableDayRepo)

	authHandler := auth.NewAuthHandler(authService)
	userHandler := user.NewUserHandler(userService)
	weeklyPreferenceHandler := weekly_preference.NewWeeklyPreferenceHandler(weeklyPreferenceService)
	templateHandler := template.NewTemplateHandler(templateService)
	busReservationHandler := bus_reservation.NewBusReservationHandler(busReservationService)
	busTripHandler := bus_trip.NewBusTripHandler(busTripService)
	busTripReportHandler := bus_trip_report.NewBusTripReportHandler(busTripReportService)
	availableOverrideHandler := available_override.NewAvailableOverrideHandler(availableOverrideService)
	unavailableDayHandler := unavailable_day.NewUnavailableDayHandler(unavailableDayService)

	return &ModuleHandlers{
		AuthHandler:              authHandler,
		UserHandler:              userHandler,
		WeeklyPreferenceHandler:  weeklyPreferenceHandler,
		TemplateHandler:          templateHandler,
		BusReservationHandler:    busReservationHandler,
		BusTripHandler:           busTripHandler,
		BusTripReportHandler:     busTripReportHandler,
		AvailableOverrideHandler: availableOverrideHandler,
		UnavailableDayHandler:    unavailableDayHandler,
	}
}
