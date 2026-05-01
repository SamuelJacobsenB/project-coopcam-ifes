package api

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RespondWithError(ctx *gin.Context, statusCode int, errCode, message string) {
	log.Printf("[%d] %s: %s (IP: %s)", statusCode, errCode, message, ctx.ClientIP())

	ctx.JSON(statusCode, ErrorResponse{
		Code:      errCode,
		Message:   message,
		RequestID: ctx.GetString("request_id"),
	})
}

// RespondWithErrorDetails retorna erro com detalhes (apenas dev)
func RespondWithErrorDetails(ctx *gin.Context, statusCode int, errCode, message, details string) {
	isDev := ctx.GetString("env") == "development"

	detailsMsg := ""
	if isDev {
		detailsMsg = details
	}

	log.Printf("[%d] %s: %s | Details: %s (IP: %s)", statusCode, errCode, message, details, ctx.ClientIP())

	ctx.JSON(statusCode, ErrorResponse{
		Code:      errCode,
		Message:   message,
		Details:   detailsMsg,
		RequestID: ctx.GetString("request_id"),
	})
}

func BadRequest(ctx *gin.Context, message string) {
	RespondWithError(ctx, http.StatusBadRequest, ErrCodeBadRequest, message)
}

func Unauthorized(ctx *gin.Context, message string) {
	RespondWithError(ctx, http.StatusUnauthorized, ErrCodeUnauthorized, message)
}

func Forbidden(ctx *gin.Context, message string) {
	RespondWithError(ctx, http.StatusForbidden, ErrCodeForbidden, message)
}

func NotFound(ctx *gin.Context, message string) {
	RespondWithError(ctx, http.StatusNotFound, ErrCodeNotFound, message)
}

func Conflict(ctx *gin.Context, message string) {
	RespondWithError(ctx, http.StatusConflict, ErrCodeConflict, message)
}

func InternalError(ctx *gin.Context, err error) {
	message := "internal server error"
	if err != nil {
		message = err.Error()
	}
	RespondWithErrorDetails(ctx, http.StatusInternalServerError, ErrCodeInternalError,
		"failed to process request", message)
}

func ServiceUnavailable(ctx *gin.Context, message string) {
	RespondWithError(ctx, http.StatusServiceUnavailable, ErrCodeServiceUnavailable, message)
}
