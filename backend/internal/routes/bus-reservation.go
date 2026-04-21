package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-reservation"
	"github.com/gin-gonic/gin"
)

func SetupBusReservationRoutes(rg *gin.RouterGroup, handler *bus_reservation.BusReservationHandler) {
	rg.GET("/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareManager(), handler.FindAll)
	rg.GET("/date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.FindByDate)
	rg.GET("/trip/:trip_id/", middlewares.RateLimiter(15), middlewares.AuthMiddlewareManager(), handler.FindByTripID)
	rg.GET("/:id/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareUser(), handler.Create)
	rg.DELETE("/:id/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareUser(), handler.Delete)
}
