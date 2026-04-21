package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/auth"
	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(rg *gin.RouterGroup, handler *auth.AuthHandler) {
	rg.POST("/login/", middlewares.RateLimiter(5), handler.Login)
	rg.GET("/logout/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareUser(), handler.Logout)

	rg.GET("/verify/user/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareUser(), handler.VerifyUser)
	rg.GET("/verify/coordinator/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareManager(), handler.VerifyCoordinator)
	rg.GET("/verify/admin/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareAdmin(), handler.VerifyAdmin)
}
