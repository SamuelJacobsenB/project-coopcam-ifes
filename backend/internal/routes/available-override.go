package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/available-override"
	"github.com/gin-gonic/gin"
)

func SetupAvailableOverrideRoutes(rg *gin.RouterGroup, handler *available_override.AvailableOverrideHandler) {
	rg.GET("/", middlewares.RateLimiter(60), middlewares.AuthMiddlewareUser(), handler.FindAll)
	rg.POST("/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareDriver(), handler.Create)
	rg.DELETE("/:id/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareDriver(), handler.Delete)
}
