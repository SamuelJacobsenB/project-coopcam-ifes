package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	unavailable_day "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/unavailable-day"
	"github.com/gin-gonic/gin"
)

func SetupUnavailableDayRoutes(rg *gin.RouterGroup, handler *unavailable_day.UnavailableDayHandler) {
	rg.GET("/", middlewares.RateLimiter(60), middlewares.AuthMiddlewareUser(), handler.FindAll)
	rg.GET("/:id/", middlewares.RateLimiter(60), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareManager(), handler.Create)
	rg.DELETE("/:id/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareManager(), handler.Delete)
}
