package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip"
	"github.com/gin-gonic/gin"
)

func SetupBusTripRoutes(rg *gin.RouterGroup, handler *bus_trip.BusTripHandler) {
	rg.GET("/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindAll)
	rg.GET("/date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByDate)
	rg.GET("/next-date/:date/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByNextDate)
	rg.GET("/:id/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/status/:status/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareManager(), handler.UpdateStatus)
	rg.DELETE("/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Delete)
}
