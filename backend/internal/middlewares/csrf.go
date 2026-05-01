package middlewares

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func CSRFProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "GET" || c.Request.Method == "HEAD" || c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		// POST, PUT, DELETE, PATCH - validar Origin
		origin := c.GetHeader("Origin")
		if origin == "" {
			// Se Origin não está presente, tenta usar Referer
			referer := c.GetHeader("Referer")
			if referer != "" {
				// Extrai origin do Referer
				if strings.HasPrefix(referer, "http://") {
					origin = strings.Split(referer[7:], "/")[0]
					origin = "http://" + origin
				} else if strings.HasPrefix(referer, "https://") {
					origin = strings.Split(referer[8:], "/")[0]
					origin = "https://" + origin
				}
			}
		}

		// Whitelist de origens permitidas
		frontendURL := os.Getenv("FRONTEND_URL")
		mobileURL := os.Getenv("MOBILE_URL")

		allowedOrigins := []string{}
		if frontendURL != "" {
			allowedOrigins = append(allowedOrigins, frontendURL)
		}
		if mobileURL != "" {
			allowedOrigins = append(allowedOrigins, mobileURL)
		}

		isAllowed := false
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				isAllowed = true
				break
			}
		}

		if !isAllowed && origin != "" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "CSRF validation failed: origin not allowed",
			})
			c.Abort()
			return
		}

		// Se origin é vazio e não conseguiu extrair de Referer, aceitar apenas se estiver em desenvolvimento
		if origin == "" && os.Getenv("ENV") != "development" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "CSRF validation failed: missing origin",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
