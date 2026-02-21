package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(rg *gin.RouterGroup, handler *user.UserHandler) {
	rg.GET("/", middlewares.AuthMiddlewareManager(), handler.FindAll)
	rg.GET("/own/", middlewares.AuthMiddlewareUser(), handler.FindOwn)
	rg.GET("/:id/", middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.AuthMiddlewareManager(), handler.Delete)

	rg.POST("/promote-to-coordinator/:id/", middlewares.AuthMiddlewareAdmin(), handler.PromoteToCoordinator)
	rg.POST("/demote-from-coordinator/:id/", middlewares.AuthMiddlewareAdmin(), handler.DemoteFromCoordinator)
	rg.POST("/promote-to-admin/:id/", middlewares.AuthMiddlewareAdmin(), handler.PromoteToAdmin)
	rg.POST("/demote-from-admin/:id/", middlewares.AuthMiddlewareAdmin(), handler.DemoteFromAdmin)

	// Test Routes for Developers
	rg.POST("/dev", handler.Create)
	rg.POST("/dev/promote-to-admin/:id/", handler.PromoteToAdmin)
}
