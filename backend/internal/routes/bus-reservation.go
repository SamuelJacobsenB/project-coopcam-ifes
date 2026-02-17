package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-reservation"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupBusReservationRoutes(rg *gin.RouterGroup, handler *bus_reservation.BusReservationHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindAll)
	rg.GET("/date/:date/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindByDate)
	rg.GET("/user-id/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByUserID)
	rg.GET("/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddleware(types.RoleUser), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.Delete)
}
