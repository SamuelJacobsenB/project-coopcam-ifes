package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip-report"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupBusTripReportRoutes(rg *gin.RouterGroup, handler *bus_trip_report.BusTripReportHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindAll)
	rg.GET("/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByID)
	rg.GET("/user-id/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByUserID)
	rg.GET("/date/:date/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindByDate)
	rg.GET("/next-date/:date/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByNextDate)
	rg.GET("/user-id/:id/date/:date/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindByUserIDAndDate)
	rg.GET("/user-id/:id/next-date/:date/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByUserIDAndNextDate)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Delete)
}
