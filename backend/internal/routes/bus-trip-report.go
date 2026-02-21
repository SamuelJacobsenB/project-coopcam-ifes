package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip-report"
	"github.com/gin-gonic/gin"
)

func SetupBusTripReportRoutes(rg *gin.RouterGroup, handler *bus_trip_report.BusTripReportHandler) {
	rg.GET("/", middlewares.AuthMiddlewareManager(), handler.FindAll)
	rg.GET("/:id/", middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.GET("/user-id/:id/", middlewares.AuthMiddlewareUser(), handler.FindByUserID)
	rg.GET("/date/:date/", middlewares.AuthMiddlewareManager(), handler.FindByDate)
	rg.GET("/next-date/:date/", middlewares.AuthMiddlewareUser(), handler.FindByNextDate)
	rg.GET("/user-id/:id/date/:date/", middlewares.AuthMiddlewareManager(), handler.FindByUserIDAndDate)
	rg.GET("/user-id/:id/next-date/:date/", middlewares.AuthMiddlewareUser(), handler.FindByUserIDAndNextDate)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddlewareManager(), handler.Delete)
}
