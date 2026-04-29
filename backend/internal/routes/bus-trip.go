package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip"
	"github.com/gin-gonic/gin"
)

func SetupBusTripRoutes(rg *gin.RouterGroup, handler *bus_trip.BusTripHandler) {
	rg.GET("/date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByDate)
	rg.GET("/:id/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.PUT("/:id/status/:status/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareAdmin(), handler.UpdateStatus)
}
