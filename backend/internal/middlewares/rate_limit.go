package middlewares

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

var commonStore = memory.NewStore()

func RateLimiter(requests int64) gin.HandlerFunc {
	rate := limiter.Rate{
		Period: time.Minute,
		Limit:  requests,
	}

	instance := limiter.New(commonStore, rate)

	return func(c *gin.Context) {
		key := c.ClientIP() + ":" + c.FullPath()

		context, err := instance.Get(c, key)
		if err != nil {
			c.Next()
			return
		}

		c.Header("X-RateLimit-Limit", strconv.FormatInt(context.Limit, 10))
		c.Header("X-RateLimit-Remaining", strconv.FormatInt(context.Remaining, 10))
		c.Header("X-RateLimit-Reset", strconv.FormatInt(context.Reset, 10))

		if context.Reached {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Muitas requisições para esta rota. Tente novamente mais tarde.",
			})
			return
		}

		c.Next()
	}
}
