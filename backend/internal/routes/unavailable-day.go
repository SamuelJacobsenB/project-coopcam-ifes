package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	unavailable_day "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/unavailable-day"
	"github.com/gin-gonic/gin"
)

func SetupUnavailableDayRoutes(rg *gin.RouterGroup, handler *unavailable_day.UnavailableDayHandler) {
	rg.GET("/", middlewares.AuthMiddlewareUser(), handler.FindAll)
	rg.GET("/:id/", middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddlewareManager(), handler.Delete)
}
