package routes

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(handlers *config.ModuleHandlers) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := router.Group("/api")
	v1 := api.Group("/v1")

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

	busTripGroup := v1.Group("/bus-trip")
	SetupBusTripRoutes(busTripGroup, handlers.BusTripHandler)

	busTripReportGroup := v1.Group("/bus-trip-report")
	SetupBusTripReportRoutes(busTripReportGroup, handlers.BusTripReportHandler)

	availableOverrideGroup := v1.Group("/available-override")
	SetupAvailableOverrideRoutes(availableOverrideGroup, handlers.AvailableOverrideHandler)

	unavailableDayGroup := v1.Group("/unavailable-day")
	SetupUnavailableDayRoutes(unavailableDayGroup, handlers.UnavailableDayHandler)

	return router
}
