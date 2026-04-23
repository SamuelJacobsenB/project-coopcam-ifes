package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/middlewares"
	monthly_payment "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/monthly-payment"
	"github.com/gin-gonic/gin"
)

func SetupMonthlyPaymentRoutes(rg *gin.RouterGroup, handler *monthly_payment.MonthlyPaymentHandler) {
	rg.GET("/user/:user_id/", middlewares.AuthMiddlewareUser(), handler.FindByUser)
	rg.GET("/year/:year/month/:month/", middlewares.AuthMiddlewareDriver(), handler.ListByPeriod)
	rg.POST("/emit-batch/", middlewares.AuthMiddlewareDriver(), middlewares.RateLimiter(2), handler.EmitBatch)
	rg.PATCH("/:id/status/", middlewares.AuthMiddlewareDriver(), handler.UpdateStatus)

	// Não uso middleware aqui porque o Mercado Pago não envia token de sessão.
	rg.POST("/webhook/mercadopago/", middlewares.RateLimiter(10), handler.HandleWebhook)
}
