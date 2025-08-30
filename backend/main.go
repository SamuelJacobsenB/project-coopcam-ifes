package main

import (
	"fmt"
	"os"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/db"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/routes"
	"github.com/gin-contrib/cors"
)

func main() {
	config.LoadEnv()

	db.ConnectDB()
	db.MigrateDB()

	handlers := config.SetupModules()
	router := routes.SetupRoutes(handlers)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
