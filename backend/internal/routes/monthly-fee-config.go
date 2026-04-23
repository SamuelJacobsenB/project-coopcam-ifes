package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	monthly_fee_config "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/monthly-fee-config"
	"github.com/gin-gonic/gin"
)

func SetupMonthlyFeeConfigRoutes(rg *gin.RouterGroup, handler *monthly_fee_config.MonthlyFeeConfigHandler) {
	rg.GET("/year/:year/", middlewares.RateLimiter(30), middlewares.AuthMiddlewareDriver(), handler.FindByYear)
	rg.POST("/", middlewares.RateLimiter(10), middlewares.AuthMiddlewareDriver(), handler.Create)
	rg.DELETE("/:id/", middlewares.RateLimiter(5), middlewares.AuthMiddlewareDriver(), handler.Delete)
}
