package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(rg *gin.RouterGroup, handler *user.UserHandler) {
	rg.GET("/", middlewares.RateLimiter(15), middlewares.AuthMiddlewareManager(), handler.FindAll)
	rg.GET("/own/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindOwn)
	rg.GET("/:id/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Create)
	rg.PUT("/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Update)
	rg.DELETE("/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareManager(), handler.Delete)

	rg.POST("/promote-to-coordinator/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.PromoteToCoordinator)
	rg.POST("/demote-from-coordinator/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.DemoteFromCoordinator)
	rg.POST("/promote-to-admin/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.PromoteToAdmin)
	rg.POST("/demote-from-admin/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.DemoteFromAdmin)
}
