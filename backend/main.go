package main

import (
	"fmt"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/db"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/routes"
)

func main() {
	config.LoadEnv()

	db.ConnectDB()
	db.MigrateDB()

	handlers := config.SetupModules()
	router := routes.SetupRoutes(handlers)

	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
