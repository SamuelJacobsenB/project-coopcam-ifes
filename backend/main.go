package main

import (
	"fmt"
	"log"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/db"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dev"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/routes"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/security"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/workers"
)

func main() {
	config.LoadEnv()

	if err := db.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.MigrateDB(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	if err := security.InitJWT(); err != nil {
		log.Fatalf("Failed to initialize JWT: %v", err)
	}

	handlers := modules.SetupModules(db.DB)

	scheduler := workers.NewScheduler()

	if err := workers.SetupTasks(scheduler, db.DB); err != nil {
		log.Fatalf("Failed to setup scheduler tasks: %v", err)
	}

	scheduler.Start()

	if os.Getenv("ENV") == "development" {
		dev.CreateAdminUser(db.DB)
	}

	router := routes.SetupRoutes(handlers)
	if err := router.Run(fmt.Sprintf(":%s", os.Getenv("PORT"))); err != nil {
		log.Fatalf("Failed to start router: %v", err)
	}
}
