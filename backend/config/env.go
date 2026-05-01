package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() error {
	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	var envFile string
	if env == "production" {
		envFile = ".env.prod"
	} else {
		envFile = ".env.dev"
	}

	if err := godotenv.Load(envFile); err != nil {
		log.Printf("Warning: Could not load %s: %v", envFile, err)
	}

	return nil
}
