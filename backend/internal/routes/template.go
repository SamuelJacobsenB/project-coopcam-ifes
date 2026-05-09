package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/template"
	"github.com/gin-gonic/gin"
)

func SetupTemplateRoutes(rg *gin.RouterGroup, handler *template.TemplateHandler) {
	rg.GET("/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByUserID)
	rg.POST("/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareUser(), handler.Create)
	rg.PUT("/", middlewares.RateLimiter(20), middlewares.AuthMiddlewareUser(), handler.Update)
	rg.DELETE("/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareUser(), handler.DeleteByUserID)
}
