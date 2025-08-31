package middlewares

import (
	"net/http"
	"strings"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/utils"
	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(allowedRoles ...types.Role) gin.HandlerFunc {
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

		token, err := utils.ParseJWT(tokenStr)
		if err != nil || !token.Valid {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing user_id in token"})
			return
		}

		roleInterfaces, ok := claims["roles"].([]interface{})
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing roles in token"})
			return
		}

		userRoles := make([]types.Role, len(roleInterfaces))
		for i, role := range roleInterfaces {
			if roleStr, ok := role.(string); ok {
				userRoles[i] = types.Role(roleStr)
			}
		}

		if !types.HasRoles(userRoles, allowedRoles...) {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient role"})
			return
		}

		ctx.Set("user_id", userID)
		ctx.Next()
	}
}
