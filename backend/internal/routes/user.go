package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(rg *gin.RouterGroup, handler *user.UserHandler) {
	rg.GET("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindAll)
	rg.GET("/own/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindOwn)
	rg.GET("/:id/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.Delete)

	rg.POST("/promote-to-coordinator/:id/", middlewares.AuthMiddleware(types.RoleAdmin), handler.PromoteToCoordinator)
	rg.POST("/demote-from-coordinator/:id/", middlewares.AuthMiddleware(types.RoleAdmin), handler.DemoteFromCoordinator)
	rg.POST("/promote-to-admin/:id/", middlewares.AuthMiddleware(types.RoleAdmin), handler.PromoteToAdmin)
	rg.POST("/demote-from-admin/:id/", middlewares.AuthMiddleware(types.RoleAdmin), handler.DemoteFromAdmin)

	// Test Routes for Developers
	rg.POST("/dev", handler.Create)
	rg.POST("/dev/promote-to-admin/:id/", handler.PromoteToAdmin)
}
