package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip-report"
	"github.com/gin-gonic/gin"
)

func SetupBusTripReportRoutes(rg *gin.RouterGroup, handler *bus_trip_report.BusTripReportHandler) {
	rg.GET("/date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindByDate)
	rg.GET("/user/:user_id/month/:month/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindByUserAndMonth)
	rg.POST("/trip/:trip_id/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareManager(), handler.CreateMany)
}
