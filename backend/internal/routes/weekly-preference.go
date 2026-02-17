package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/weekly-preference"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupWeeklyPreferenceRoutes(rg *gin.RouterGroup, handler *weekly_preference.WeeklyPreferenceHandler) {
	rg.GET("/user-id/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByUserID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Delete)
}
