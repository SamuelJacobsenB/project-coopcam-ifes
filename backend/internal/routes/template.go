package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/template"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupTemplateRoutes(rg *gin.RouterGroup, handler *template.TemplateHandler) {
	rg.GET("/user-id/:id", middlewares.AuthMiddleware(types.RoleUser), handler.FindByUserID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Create)
	rg.PUT("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Update)
	rg.DELETE("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Delete)
}
