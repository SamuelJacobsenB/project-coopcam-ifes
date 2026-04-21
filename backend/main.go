package main

import (
	"fmt"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/db"
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

	scheduler.Start()

	router := routes.SetupRoutes(handlers)
	if err := router.Run(fmt.Sprintf(":%s", os.Getenv("PORT"))); err != nil {
		panic(err)
	}
}
