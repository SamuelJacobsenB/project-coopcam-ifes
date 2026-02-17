package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/monthly_payment"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func SetupMonthlyPaymentRoutes(rg *gin.RouterGroup, handler *monthly_payment.MonthlyPaymentHandler) {
	rg.GET("/own/", middlewares.AuthMiddleware(types.RoleUser, types.RoleCoordinator, types.RoleAdmin), handler.FindByUser)
	rg.POST("/", middlewares.AuthMiddleware(types.RoleAdmin), handler.Create)
	rg.PATCH("/:id/status/", middlewares.AuthMiddleware(types.RoleAdmin), handler.UpdateStatus)
	rg.GET("/user/:user_id/", middlewares.AuthMiddleware(types.RoleCoordinator, types.RoleAdmin), handler.FindByUser)
}
