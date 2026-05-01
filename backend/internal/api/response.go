package api

import (
	"github.com/gin-gonic/gin"
)

const (
	ErrCodeBadRequest         = "BAD_REQUEST"
	ErrCodeNotFound           = "NOT_FOUND"
	ErrCodeUnauthorized       = "UNAUTHORIZED"
	ErrCodeForbidden          = "FORBIDDEN"
	ErrCodeConflict           = "CONFLICT"
	ErrCodeInternalError      = "INTERNAL_SERVER_ERROR"
	ErrCodeServiceUnavailable = "SERVICE_UNAVAILABLE"
)

type ErrorResponse struct {
	Code      string `json:"code"`
	Message   string `json:"message"`
	Details   string `json:"details,omitempty"`
	RequestID string `json:"request_id,omitempty"`
}

type SuccessResponse struct {
	Code      string      `json:"code"`
	Data      interface{} `json:"data"`
	Message   string      `json:"message,omitempty"`
	RequestID string      `json:"request_id,omitempty"`
}

func RespondWithSuccess(ctx *gin.Context, statusCode int, data interface{}) {
	ctx.JSON(statusCode, SuccessResponse{
		Code:      "SUCCESS",
		Data:      data,
		RequestID: ctx.GetString("request_id"),
	})
}
