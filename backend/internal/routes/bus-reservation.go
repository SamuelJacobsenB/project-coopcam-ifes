package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-reservation"
	"github.com/gin-gonic/gin"
)

func SetupBusReservationRoutes(rg *gin.RouterGroup, handler *bus_reservation.BusReservationHandler) {
	rg.GET("/", middlewares.AuthMiddlewareManager(), handler.FindAll)
	rg.GET("/date/:date/", middlewares.AuthMiddlewareManager(), handler.FindByDate)
	rg.GET("/user-id/:id/", middlewares.AuthMiddlewareUser(), handler.FindByUserID)
	rg.GET("/:id/", middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddlewareUser(), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddlewareUser(), handler.Delete)
}
