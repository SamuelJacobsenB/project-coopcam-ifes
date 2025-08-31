package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/middlewares"
	available_override "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/available-override"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupAvailableOverrideRoutes(rg *gin.RouterGroup, handler *available_override.AvailableOverrideHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleUser), handler.FindAll)
	rg.GET("/:id", middlewares.AuthMiddleware(types.RoleUser), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Create)
	rg.PUT("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Update)
	rg.DELETE("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Delete)
}
