package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/template"
	"github.com/gin-gonic/gin"
)

func SetupTemplateRoutes(rg *gin.RouterGroup, handler *template.TemplateHandler) {
	rg.GET("/user-id/:id/", middlewares.AuthMiddlewareUser(), handler.FindByUserID)
	rg.POST("/", middlewares.AuthMiddlewareUser(), handler.Create)
	rg.PUT("/", middlewares.AuthMiddlewareUser(), handler.Update)
	rg.DELETE("/", middlewares.AuthMiddlewareUser(), handler.DeleteByUserID)
}
