package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/available-override"
	"github.com/gin-gonic/gin"
)

func SetupAvailableOverrideRoutes(rg *gin.RouterGroup, handler *available_override.AvailableOverrideHandler) {
	rg.GET("/", middlewares.RateLimiter(60), middlewares.AuthMiddlewareUser(), handler.FindAll)
	rg.GET("/:id/", middlewares.RateLimiter(60), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareManager(), handler.Create)
	rg.DELETE("/:id/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareManager(), handler.Delete)
}
