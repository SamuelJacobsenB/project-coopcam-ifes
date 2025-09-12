package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	unavailable_day "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/unavailable-day"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupUnavailableDayRoutes(rg *gin.RouterGroup, handler *unavailable_day.UnavailableDayHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleUser), handler.FindAll)
	rg.GET("/:id", middlewares.AuthMiddleware(types.RoleUser), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Create)
	rg.PUT("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Update)
	rg.DELETE("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Delete)
}

