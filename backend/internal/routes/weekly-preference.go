package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/weekly-preference"
	"github.com/gin-gonic/gin"
)

func SetupWeeklyPreferenceRoutes(rg *gin.RouterGroup, handler *weekly_preference.WeeklyPreferenceHandler) {
	rg.GET("/user/:id/", middlewares.AuthMiddlewareUser(), handler.FindByUserID)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddlewareManager(), handler.Delete)
}
