package routes

import (
	"os"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/unrolled/secure"
)

func SetupRoutes(handlers *modules.ModuleHandlers) *gin.Engine {
	router := gin.Default()

	isDev := os.Getenv("ENV") == "development"

	secureMiddleware := secure.New(secure.Options{
		FrameDeny:             true,
		ContentTypeNosniff:    true,
		BrowserXssFilter:      true,
		ContentSecurityPolicy: "default-src 'self'",

		ReferrerPolicy: os.Getenv("SECURE_REFERRER_POLICY"),

		IsDevelopment:        isDev,
		SSLRedirect:          !isDev,
		STSSeconds:           31536000, // 1 ano
		STSIncludeSubdomains: true,
		STSPreload:           true,
	})

	router.Use(func(c *gin.Context) {
		err := secureMiddleware.Process(c.Writer, c.Request)
		if err != nil {
			c.Abort()
			return
		}
		c.Next()
	})

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_URL"), os.Getenv("MOBILE_URL")},
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	csrfConfg := middlewares.NewCSRFConfig()
	router.Use(middlewares.CSRFProtection(csrfConfg))

	router.Use(middlewares.RateLimiter(config.RateLimitPerMinute))

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

	monthlyPaymentGroup := v1.Group("/monthly-payment")
	SetupMonthlyPaymentRoutes(monthlyPaymentGroup, handlers.MonthlyPaymentHandler)

	monthlyFeeGroup := v1.Group("/monthly-fee-config")
	SetupMonthlyFeeConfigRoutes(monthlyFeeGroup, handlers.MonthlyFeeConfigHandler)

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
