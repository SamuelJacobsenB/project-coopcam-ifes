package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/weekly-preference"
	"github.com/gin-gonic/gin"
)

func SetupWeeklyPreferenceRoutes(rg *gin.RouterGroup, handler *weekly_preference.WeeklyPreferenceHandler) {
	rg.GET("/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByUserID)
	rg.POST("/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Delete)
}
