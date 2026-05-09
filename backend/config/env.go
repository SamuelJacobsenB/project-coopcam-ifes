package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	var envFile string
	if env == "production" {
		envFile = ".env.prod"
	} else if env == "development" {
		envFile = ".env.dev"
	} else {
		log.Fatalf("ENV must be 'development' or 'production', got: %s", env)
	}

	if err := godotenv.Load(envFile); err != nil {
		log.Printf("Warning: Could not load %s: %v", envFile, err)
	}
}
