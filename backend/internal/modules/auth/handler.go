package auth

import (
	"net/http"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *AuthService
}

func NewAuthHandler(service *AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (handler *AuthHandler) Login(ctx *gin.Context) {
	var loginDTO dtos.LoginDTO
	if err := ctx.ShouldBindJSON(&loginDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	token, err := handler.service.Login(&loginDTO)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciais inválidas"})
		return
	}

	isProd := os.Getenv("SECURE") == "true"

	ctx.SetSameSite(http.SameSiteStrictMode)
	ctx.SetCookie(
		"auth_token",
		token,
		3600*24,
		"/",
		os.Getenv("DOMAIN"),
		isProd,
		true,
	)

	ctx.JSON(http.StatusOK, gin.H{"token": "Bearer " + token})
}

func (handler *AuthHandler) Logout(ctx *gin.Context) {
	ctx.SetCookie("auth_token", "", -1, "/", os.Getenv("DOMAIN"), os.Getenv("SECURE") == "true", true)
	ctx.JSON(http.StatusOK, gin.H{"message": "Logout realizado"})
}

func (handler *AuthHandler) VerifyUser(ctx *gin.Context) {
	ctx.JSON(200, nil)
}

func (handler *AuthHandler) VerifyDriver(ctx *gin.Context) {
	ctx.JSON(200, nil)
}

func (handler *AuthHandler) VerifyAdmin(ctx *gin.Context) {
	ctx.JSON(200, nil)
}
