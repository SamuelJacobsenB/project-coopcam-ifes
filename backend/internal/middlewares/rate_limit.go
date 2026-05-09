package middlewares

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/ulule/limiter/v3"
	limiterredis "github.com/ulule/limiter/v3/drivers/store/redis"
)

func newStore() limiter.Store {
	redisURL := os.Getenv("REDIS_URL")

	// Se REDIS_URL estiver vazia inicia um miniredis (development)
	if redisURL == "" {
		mini, err := miniredis.Run()
		if err != nil {
			log.Fatalf("[rate-limiter] could not start embedded Redis: %v", err)
		}

		// Sincroniza o relógio interno do miniredis
		mini.SetTime(time.Now())
		go func() {
			for {
				time.Sleep(100 * time.Millisecond)
				mini.SetTime(time.Now())
			}
		}()

		redisURL = "redis://" + mini.Addr()
		log.Printf("[rate-limiter] embedded Redis started at %s", mini.Addr())
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("[rate-limiter] invalid REDIS_URL: %v", err)
	}

	client := redis.NewClient(opt)

	pingCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := client.Ping(pingCtx).Err(); err != nil {
		log.Fatalf("[rate-limiter] could not reach Redis at %s: %v", redisURL, err)
	}

	store, err := limiterredis.NewStoreWithOptions(client, limiter.StoreOptions{
		Prefix:          "rate",
		MaxRetry:        3,
		CleanUpInterval: time.Minute,
	})
	if err != nil {
		log.Fatalf("[rate-limiter] could not create Redis store: %v", err)
	}

	log.Printf("[rate-limiter] connected to Redis at %s", redisURL)
	return store
}

var commonStore = newStore()

func RateLimiter(requests int64) gin.HandlerFunc {
	rate := limiter.Rate{
		Period: time.Minute,
		Limit:  requests,
	}

	instance := limiter.New(commonStore, rate)

	return func(c *gin.Context) {
		// A chave para o Redis: IP + método http + rota da api
		key := c.ClientIP() + ":" + c.Request.Method + ":" + c.FullPath()

		ctx, err := instance.Get(c.Request.Context(), key)
		if err != nil {
			log.Printf("[rate-limiter] store error (fail-open): %v", err)
			c.Next()
			return
		}

		c.Header("X-RateLimit-Limit", strconv.FormatInt(ctx.Limit, 10))
		c.Header("X-RateLimit-Remaining", strconv.FormatInt(ctx.Remaining, 10))
		c.Header("X-RateLimit-Reset", strconv.FormatInt(ctx.Reset, 10))

		if ctx.Reached {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Muitas requisições para esta rota. Tente novamente mais tarde",
			})
			return
		}

		c.Next()
	}
}
