package middlewares

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

func RateLimiter(requestsPerMinute int) gin.HandlerFunc {
	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  int64(requestsPerMinute),
	}

	store := memory.NewStore()
	instance := limiter.New(store, rate)

	return mgin.NewMiddleware(instance, mgin.WithLimitReachedHandler(func(c *gin.Context) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error": "Muitas requisições. Tente novamente mais tarde.",
		})
		c.Abort()
	}))
}
