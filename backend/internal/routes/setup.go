package routes

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/config"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(handlers *config.ModuleHandlers) *gin.Engine {
	router := gin.Default()

	return router
}
