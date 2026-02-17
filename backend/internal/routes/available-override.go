package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/available-override"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupAvailableOverrideRoutes(rg *gin.RouterGroup, handler *available_override.AvailableOverrideHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindAll)
	rg.GET("/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Delete)
}
