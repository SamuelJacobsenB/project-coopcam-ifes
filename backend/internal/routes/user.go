package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(rg *gin.RouterGroup, handler *user.UserHandler) {
	rg.GET("/", middlewares.RateLimiter(15), middlewares.AuthMiddlewareAdmin(), handler.FindMany)
	rg.GET("/own/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindOwn)
	rg.GET("/:id/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.FindByID)
	rg.POST("/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.Create)
	rg.PUT("/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.Update)
	rg.DELETE("/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.Delete)

	rg.POST("/promote-to-driver/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.PromoteToDriver)
	rg.POST("/promote-to-admin/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.PromoteToAdmin)
	rg.POST("/demote/:id/", middlewares.RateLimiter(3), middlewares.AuthMiddlewareAdmin(), handler.DemoteToUser)
}
