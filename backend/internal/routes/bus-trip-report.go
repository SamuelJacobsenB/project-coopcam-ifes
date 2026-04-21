package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip-report"
	"github.com/gin-gonic/gin"
)

func SetupBusTripReportRoutes(rg *gin.RouterGroup, handler *bus_trip_report.BusTripReportHandler) {
	rg.GET("/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindAll)
	rg.GET("/:id/", middlewares.RateLimiter(40), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.GET("/date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindByDate)
	rg.GET("/next-date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByNextDate)
	rg.GET("/user-id/:id/date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindByUserIDAndDate)
	rg.GET("/user/:user_id/month/:month/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindByUserAndMonth)
	rg.GET("/user-id/:id/next-date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByUserIDAndNextDate)
	rg.POST("/trip/:trip_id/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareManager(), handler.CreateMany)
	rg.DELETE("/:id/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareManager(), handler.Delete)
}
