package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	env := os.Getenv("ENV")

	var envFile string
	if env == "production" {
		envFile = ".env.prod"
	} else {
		envFile = ".env.dev"
	}

	err := godotenv.Load(envFile)
	if err != nil {
		log.Fatalf("Erro ao carregar %s: %v", envFile, err)
	}
}
