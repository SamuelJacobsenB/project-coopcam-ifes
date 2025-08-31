package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/config"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(handlers *config.ModuleHandlers) *gin.Engine {
	router := gin.Default()

	v1 := router.Group("/v1")

	authGroup := v1.Group("/auth")
	SetupAuthRoutes(authGroup, handlers.AuthHandler)

	userGroup := v1.Group("/user")
	SetupUserRoutes(userGroup, handlers.UserHandler)

	weeklyPreferenceGroup := v1.Group("/weekly-preference")
	SetupWeeklyPreferenceRoutes(weeklyPreferenceGroup, handlers.WeeklyPreferenceHandler)

	templateGroup := v1.Group("/template")
	SetupTemplateRoutes(templateGroup, handlers.TemplateHandler)

	busReservationGroup := v1.Group("/bus-reservation")
	SetupBusReservationRoutes(busReservationGroup, handlers.BusReservationHandler)

	busTripReportGroup := v1.Group("/bus-trip-report")
	SetupBusTripReportRoutes(busTripReportGroup, handlers.BusTripReportHandler)

	availableOverrideGroup := v1.Group("/available-override")
	SetupAvailableOverrideRoutes(availableOverrideGroup, handlers.AvailableOverrideHandler)

	unavailableDayGroup := v1.Group("/unavailable-day")
	SetupUnavailableDayRoutes(unavailableDayGroup, handlers.UnavailableDayHandler)

	return router
}
