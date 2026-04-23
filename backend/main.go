package main

import (
	"fmt"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/db"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dev"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/routes"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/workers"
)

func main() {
	config.LoadEnv()

	db.ConnectDB()
	db.MigrateDB()

	handlers := config.SetupModules(db.DB)

	scheduler := workers.NewScheduler()

	err := scheduler.RegisterTask("0 1 * * 0", func() {
		workers.CreateTripsAndWeeklyPreferences(db.DB)
	})
	if err != nil {
		panic(err)
	}

	err = scheduler.RegisterTask("0 1 31 12 *", func() {
		workers.DeleteOldInformation(db.DB)
	})
	if err != nil {
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
