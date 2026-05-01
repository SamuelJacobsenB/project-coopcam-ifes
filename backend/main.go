package main

import (
	"fmt"
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
	if err := config.LoadEnv(); err != nil {
		panic(err)
	}

	if err := db.ConnectDB(); err != nil {
		panic(err)
	}

	if err := db.MigrateDB(); err != nil {
		panic(err)
	}

	if err := security.InitJWT(); err != nil {
		panic(err)
	}

	handlers := modules.SetupModules(db.DB)

	scheduler := workers.NewScheduler()

	if err := workers.SetupTasks(scheduler, db.DB); err != nil {
		panic(err)
	}

	scheduler.Start()

	if os.Getenv("ENV") == "development" {
		dev.CreateAdminUser(db.DB)
	}

	router := routes.SetupRoutes(handlers)
	if err := router.Run(fmt.Sprintf(":%s", os.Getenv("PORT"))); err != nil {
		panic(err)
	}
}
