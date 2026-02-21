package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/available-override"
	"github.com/gin-gonic/gin"
)

func SetupAvailableOverrideRoutes(rg *gin.RouterGroup, handler *available_override.AvailableOverrideHandler) {
	rg.GET("/", middlewares.AuthMiddlewareUser(), handler.FindAll)
	rg.GET("/:id/", middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddlewareManager(), handler.Delete)
}
