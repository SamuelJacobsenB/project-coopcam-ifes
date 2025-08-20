package user

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/template"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/weekly-preference"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID
	Name     string
	Email    string
	Password string
	Roles    []types.Role

	CPF    string
	Phone  string
	Adress string
	CEP    string
	Birth  time.Time

	Template         template.Template
	WeeklyPreference weekly_preference.WeeklyPreference

	CreatedAt time.Time
	UpdatedAt time.Time
}
