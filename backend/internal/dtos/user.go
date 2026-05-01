package dtos

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/security"
	"github.com/google/uuid"
)

type UserRequestDTO struct {
	Name            string    `json:"name" binding:"required"`
	Email           string    `json:"email" binding:"required,email"`
	Password        string    `json:"password" binding:"required"`
	CPF             string    `json:"cpf" binding:"required"`
	Phone           string    `json:"phone" binding:"required"`
	Address         string    `json:"address" binding:"required"`
	CEP             string    `json:"cep" binding:"required"`
	Birth           time.Time `json:"birth" binding:"required"`
	HasFinancialAid bool      `json:"has_financial_aid"`
}

func (dto *UserRequestDTO) Validate() error {
	if err := security.ValidateName(dto.Name); err != nil {
		return err
	}

	if err := security.ValidateEmail(dto.Email); err != nil {
		return err
	}

	if err := security.ValidatePassword(dto.Password); err != nil {
		return err
	}

	if err := security.ValidateCPF(dto.CPF); err != nil {
		return err
	}

	if err := security.ValidatePhone(dto.Phone); err != nil {
		return err
	}

	if dto.Address == "" || len(dto.Address) < 3 || len(dto.Address) > 128 {
		return errors.New("invalid address")
	}

	if err := security.ValidateCEP(dto.CEP); err != nil {
		return err
	}

	if dto.Birth.IsZero() {
		return errors.New("birth date is required")
	}

	now := time.Now()
	age := now.Year() - dto.Birth.Year()
	if age < 18 {
		return errors.New("user must be at least 18 years old")
	}

	return nil
}

func (dto *UserRequestDTO) ToEntity() *entities.User {
	return &entities.User{
		Name:            dto.Name,
		Email:           dto.Email,
		Password:        dto.Password, // Será feito hash no service
		CPF:             dto.CPF,
		Phone:           dto.Phone,
		Address:         dto.Address,
		CEP:             dto.CEP,
		Birth:           dto.Birth,
		HasFinancialAid: dto.HasFinancialAid,
	}
}

type UserUpdateDTO struct {
	Name            *string    `json:"name"`
	Email           *string    `json:"email"`
	Password        *string    `json:"password"`
	CPF             *string    `json:"cpf"`
	Phone           *string    `json:"phone"`
	Address         *string    `json:"address"`
	CEP             *string    `json:"cep"`
	Birth           *time.Time `json:"birth"`
	HasFinancialAid *bool      `json:"has_financial_aid"`
}

func (dto *UserUpdateDTO) Validate() error {
	if dto.Name != nil && *dto.Name != "" {
		if err := security.ValidateName(*dto.Name); err != nil {
			return err
		}
	}

	if dto.Email != nil && *dto.Email != "" {
		if err := security.ValidateEmail(*dto.Email); err != nil {
			return err
		}
	}

	if dto.Password != nil && *dto.Password != "" {
		if err := security.ValidatePassword(*dto.Password); err != nil {
			return err
		}
	}

	if dto.CPF != nil && *dto.CPF != "" {
		if err := security.ValidateCPF(*dto.CPF); err != nil {
			return err
		}
	}

	if dto.Phone != nil && *dto.Phone != "" {
		if err := security.ValidatePhone(*dto.Phone); err != nil {
			return err
		}
	}

	if dto.Address != nil && *dto.Address != "" {
		if len(*dto.Address) < 3 {
			return errors.New("endereço inválido")
		}
	}

	if dto.CEP != nil && *dto.CEP != "" {
		if err := security.ValidateCEP(*dto.CEP); err != nil {
			return err
		}
	}

	if dto.Birth != nil && dto.Birth.IsZero() {
		return errors.New("data de nascimento é obrigatória")
	}

	return nil
}

func (dto *UserUpdateDTO) ToEntity() *entities.User {
	user := entities.User{}

	if dto.Name != nil {
		user.Name = *dto.Name
	}
	if dto.Email != nil {
		user.Email = *dto.Email
	}
	if dto.Password != nil {
		user.Password = *dto.Password
	}
	if dto.CPF != nil {
		user.CPF = *dto.CPF
	}
	if dto.Phone != nil {
		user.Phone = *dto.Phone
	}
	if dto.Address != nil {
		user.Address = *dto.Address
	}
	if dto.CEP != nil {
		user.CEP = *dto.CEP
	}
	if dto.Birth != nil {
		user.Birth = *dto.Birth
	}
	if dto.HasFinancialAid != nil {
		user.HasFinancialAid = *dto.HasFinancialAid
	}

	return &user
}

type UserResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`

	CPF     string `json:"cpf"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	CEP     string `json:"cep"`
	Birth   string `json:"birth"`

	HasFinancialAid bool `json:"has_financial_aid"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToUserResponseDTO(entity *entities.User) *UserResponseDTO {
	return &UserResponseDTO{
		ID:              entity.ID,
		Name:            entity.Name,
		Email:           entity.Email,
		Role:            entity.Role,
		CPF:             entity.CPF,
		Phone:           entity.Phone,
		Address:         entity.Address,
		CEP:             entity.CEP,
		Birth:           entity.Birth.Format("02/01/2006"),
		HasFinancialAid: entity.HasFinancialAid,
		CreatedAt:       entity.CreatedAt,
		UpdatedAt:       entity.UpdatedAt,
	}
}
