package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/auth"
	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(rg *gin.RouterGroup, handler *auth.AuthHandler) {
	rg.POST("/login/", handler.Login)
	rg.GET("/logout/", middlewares.AuthMiddlewareManager(), handler.Logout)

	rg.GET("/verify/user/", middlewares.AuthMiddlewareUser(), handler.VerifyUser)
	rg.GET("/verify/coordinator/", middlewares.AuthMiddlewareManager(), handler.VerifyCoordinator)
	rg.GET("/verify/admin/", middlewares.AuthMiddlewareAdmin(), handler.VerifyAdmin)
}
