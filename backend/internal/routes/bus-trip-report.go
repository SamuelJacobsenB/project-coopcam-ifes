package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/middlewares"
	bus_trip_report "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/bus-trip-report"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupBusTripReportRoutes(rg *gin.RouterGroup, handler *bus_trip_report.BusTripReportHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.FindAll)
	rg.GET("/:id", middlewares.AuthMiddleware(types.RoleUser), handler.FindByID)
	rg.GET("/user-id/:id", middlewares.AuthMiddleware(types.RoleUser), handler.FindByUserID)
	rg.GET("/date/:date", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.FindByDate)
	rg.GET("/next-date/:date", middlewares.AuthMiddleware(types.RoleUser), handler.FindByNextDate)
	rg.GET("/user-id/:id/date/:date", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.FindByUserIDAndDate)
	rg.GET("/user-id/:id/next-date/:date", middlewares.AuthMiddleware(types.RoleUser), handler.FindByUserIDAndNextDate)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Create)
	rg.PUT("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Update)
	rg.DELETE("/:id", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.Delete)
}
