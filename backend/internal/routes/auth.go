package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/auth"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(rg *gin.RouterGroup, handler *auth.AuthHandler) {
	rg.POST("/login", handler.Login)
	rg.GET("/logout", middlewares.AuthMiddleware(types.RoleUser), handler.Logout)

	rg.GET("/verify/user", middlewares.AuthMiddleware(types.RoleUser), handler.VerifyUser)
	rg.GET("/verify/coordinator", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator), handler.VerifyCoordinator)
	rg.GET("/verify/admin", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.VerifyAdmin)
}

