package auth

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *AuthService
}

func NewAuthHandler(service *AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (handler *AuthHandler) Login(ctx *gin.Context) {
	var loginDTO LoginDTO
	if err := ctx.ShouldBindJSON(&loginDTO); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := handler.service.Login(&loginDTO)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("auth_token", token, 3600*24*30, "/", os.Getenv("DOMAIN"), os.Getenv("SECURE") == "true", true)

	ctx.JSON(200, gin.H{"token": "Bearer " + token})
}

func (handler *AuthHandler) Logout(ctx *gin.Context) {
	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("auth_token", "", -1, "/", os.Getenv("DOMAIN"), os.Getenv("SECURE") == "true", true)
	ctx.JSON(200, nil)
}

func (handler *AuthHandler) VerifyUser(ctx *gin.Context) {
	ctx.JSON(200, nil)
}

func (handler *AuthHandler) VerifyCoordinator(ctx *gin.Context) {
	ctx.JSON(200, nil)
}

func (handler *AuthHandler) VerifyAdmin(ctx *gin.Context) {
	ctx.JSON(200, nil)
}
