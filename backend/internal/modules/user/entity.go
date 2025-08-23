package user

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/template"
	weekly_preference "github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/weekly-preference"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`

	Name     string       `gorm:"uniqueIndex;not null" json:"name"`
	Email    string       `gorm:"uniqueIndex;not null" json:"email"`
	Password string       `json:"password"`
	Roles    []types.Role `gorm:"type:text[]" json:"roles"`

	CPF       string    `json:"cpf"`
	Phone     string    `json:"phone"`
	Adress    string    `json:"adress"`
	CEP       string    `json:"cep"`
	Birth     time.Time `json:"birth"`
	AvatarURL string    `json:"avatar_url"`

	Template         template.Template                  `gorm:"foreignKey:UserID" json:"template"`
	WeeklyPreference weekly_preference.WeeklyPreference `gorm:"foreignKey:UserID" json:"weekly_preference"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (entity *User) ToResponseDTO() *UserResponseDTO {
	return &UserResponseDTO{
		ID:        entity.ID,
		Name:      entity.Name,
		Email:     entity.Email,
		Roles:     entity.Roles,
		CPF:       entity.CPF,
		Phone:     entity.Phone,
		Adress:    entity.Adress,
		CEP:       entity.CEP,
		Birth:     entity.Birth.Format("01/01/2001"),
		AvatarURL: entity.AvatarURL,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
