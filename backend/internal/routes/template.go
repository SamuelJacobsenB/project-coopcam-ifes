package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/template"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupTemplateRoutes(rg *gin.RouterGroup, handler *template.TemplateHandler) {
	rg.GET("/user-id/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByUserID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.Create)
	rg.PUT("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.Update)
	rg.DELETE("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.DeleteByUserID)
}
