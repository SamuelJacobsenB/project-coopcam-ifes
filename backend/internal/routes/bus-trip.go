package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/middlewares"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/bus-trip"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupBusTripRoutes(rg *gin.RouterGroup, handler *bus_trip.BusTripHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleUser), handler.FindAll)
	rg.GET("/date/:date", middlewares.AuthMiddleware(types.RoleUser), handler.FindByDate)
	rg.GET("/next-date/:date", middlewares.AuthMiddleware(types.RoleUser), handler.FindByNextDate)
	rg.GET("/:id", middlewares.AuthMiddleware(types.RoleUser), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Create)
	rg.PUT("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Update)
	rg.DELETE("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Delete)
}
