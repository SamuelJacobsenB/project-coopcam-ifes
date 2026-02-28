package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	monthly_fee_config "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/monthly-fee-config"
	"github.com/gin-gonic/gin"
)

func SetupMonthlyFeeConfigRoutes(rg *gin.RouterGroup, handler *monthly_fee_config.MonthlyFeeConfigHandler) {
	rg.GET("/:id", middlewares.AuthMiddlewareManager(), handler.FindByID)
	rg.GET("/year/:year", middlewares.AuthMiddlewareManager(), handler.FindByYear)
	rg.POST("/", middlewares.AuthMiddlewareManager(), handler.Create)
	rg.DELETE("/:id", middlewares.AuthMiddlewareManager(), handler.Delete)
}
