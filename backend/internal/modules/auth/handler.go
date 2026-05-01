package auth

import (
	"net/http"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/audit"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *AuthService
	logger  *audit.AuditLogger
}

func NewAuthHandler(service *AuthService, logger *audit.AuditLogger) *AuthHandler {
	return &AuthHandler{service, logger}
}

func (handler *AuthHandler) Login(ctx *gin.Context) {
	var loginDTO dtos.LoginDTO
	if err := ctx.ShouldBindJSON(&loginDTO); err != nil {
		api.BadRequest(ctx, "Dados inválidos")
		return
	}

	if err := loginDTO.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	token, err := handler.service.Login(&loginDTO)
	if err != nil {
		handler.logger.LogLoginAttempt(ctx, loginDTO.Email, ctx.ClientIP(), false, err.Error())
		api.Unauthorized(ctx, "Email ou senha incorretos")
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

	handler.logger.LogLoginAttempt(ctx, loginDTO.Email, ctx.ClientIP(), true, "")

	api.RespondWithSuccess(ctx, http.StatusOK, gin.H{
		"token": "Bearer " + token,
	})
}

func (handler *AuthHandler) Logout(ctx *gin.Context) {
	ctx.SetCookie("auth_token", "", -1, "/", os.Getenv("DOMAIN"), os.Getenv("SECURE") == "true", true)
	api.RespondWithSuccess(ctx, http.StatusOK, "Deslogado com sucesso")
}

func (handler *AuthHandler) VerifyUser(ctx *gin.Context) {
	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}

func (handler *AuthHandler) VerifyDriver(ctx *gin.Context) {
	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}

func (handler *AuthHandler) VerifyAdmin(ctx *gin.Context) {
	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}
