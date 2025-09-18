package main

import (
	"fmt"
	"os"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/config"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/db"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/routes"
)

func main() {
	config.LoadEnv()

	db.ConnectDB()
	db.MigrateDB()

	handlers := config.SetupModules(db.DB)
	router := routes.SetupRoutes(handlers)

	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
