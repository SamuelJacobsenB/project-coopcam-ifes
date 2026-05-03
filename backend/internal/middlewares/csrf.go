package middlewares

import (
	"net/url"
	"os"
	"strings"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CSRFConfig guarda as origens permitidas carregadas no startup
type CSRFConfig struct {
	AllowedOrigins map[string]bool
	IsDev          bool
}

func NewCSRFConfig() *CSRFConfig {
	origins := make(map[string]bool)
	env := os.Getenv("ENV")

	// Carrega e normaliza URLs permitidas
	keys := []string{"FRONTEND_URL", "MOBILE_URL", "DRIVER_URL"}
	for _, key := range keys {
		val := os.Getenv(key)
		if val != "" {
			origins[strings.ToLower(val)] = true
		}
	}

	return &CSRFConfig{
		AllowedOrigins: origins,
		IsDev:          env == "development",
	}
}

func CSRFProtection(config *CSRFConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Métodos seguros são ignorados
		if isSafeMethod(c.Request.Method) {
			c.Next()
			return
		}

		origin := c.GetHeader("Origin")

		// 2. Se não houver Origin, tenta o Referer (fallback comum)
		if origin == "" {
			origin = c.GetHeader("Referer")
		}

		// 3. Validação em Produção
		if origin == "" {
			if !config.IsDev {
				abortWithCSRFError(c, "Missing Origin/Referer header")
				return
			}
			c.Next()
			return
		}

		// 4. Parse e validação da URL
		parsedOrigin, err := url.Parse(origin)
		if err != nil {
			abortWithCSRFError(c, "Invalid origin format")
			return
		}

		// Reconstrói a base do origin para comparação (scheme://host)
		// Isso evita problemas com caminhos no Referer
		originBase := strings.ToLower(parsedOrigin.Scheme + "://" + parsedOrigin.Host)

		// 5. Verifica se a origem está na lista de permissões
		if !config.AllowedOrigins[originBase] {
			// Se for dev e localhost, permite (ajuste conforme sua necessidade)
			if config.IsDev && strings.Contains(originBase, "localhost") {
				c.Next()
				return
			}

			abortWithCSRFError(c, "Origin not allowed")
			return
		}

		c.Next()
	}
}

func isSafeMethod(method string) bool {
	return method == "GET" || method == "HEAD" || method == "OPTIONS" || method == "TRACE"
}

func abortWithCSRFError(c *gin.Context, msg string) {
	c.JSON(http.StatusForbidden, gin.H{
		"error": "CSRF validation failed: " + msg,
	})
	c.Abort()
}