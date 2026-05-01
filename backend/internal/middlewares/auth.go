package middlewares

import (
	"net/http"
	"strings"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/security"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var tokenStr string
		var err error

		tokenStr, err = ctx.Cookie("auth_token")
		if err != nil || tokenStr == "" {
			authHeader := ctx.GetHeader("Authorization")

			if len(authHeader) > 7 && strings.HasPrefix(authHeader, "Bearer ") {
				tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
			} else {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
				return
			}
		}

		claims, err := security.ValidateToken(tokenStr)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if !types.HasRole(claims.Role, []string(allowedRoles)) {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient role"})
			return
		}

		ctx.Set("user_id", claims.UserID)
		ctx.Set("user_role", claims.Role)
		ctx.Next()
	}
}

func AuthMiddlewareUser() gin.HandlerFunc {
	return AuthMiddleware(types.RoleUser, types.RoleDriver, types.RoleAdmin)
}

func AuthMiddlewareDriver() gin.HandlerFunc {
	return AuthMiddleware(types.RoleDriver, types.RoleAdmin)
}

func AuthMiddlewareAdmin() gin.HandlerFunc {
	return AuthMiddleware(types.RoleAdmin)
}
