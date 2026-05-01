package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.Background()

func getRedis() *redis.Client {
	if rdb == nil {
		addr := os.Getenv("REDIS_URL")
		rdb = redis.NewClient(&redis.Options{
			Addr: addr,
		})
	}
	return rdb
}

func RateLimiter(limit int) gin.HandlerFunc {
	client := getRedis()

	return func(c *gin.Context) {
		if client == nil {
			c.Next()
			return
		}

		key := fmt.Sprintf("rate_limit:%s:%s:%s", c.ClientIP(), c.Request.Method, c.Request.URL.Path)

		// Executa INCR. Se a chave não existir, o Redis cria com valor 1.
		count, err := client.Incr(ctx, key).Result()
		if err != nil {
			c.Next()
			return
		}

		// Se for a primeira requisição desse ciclo, define o tempo de expiração
		if count == 1 {
			client.Expire(ctx, key, time.Minute)
		}

		if int(count) > limit {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Muitas requisições. Tente novamente mais tarde.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
