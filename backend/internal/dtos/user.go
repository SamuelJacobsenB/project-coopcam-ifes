package dtos

import (
	"errors"
	"strings"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/utils/validators"
	"github.com/google/uuid"
)

type UserRequestDTO struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`

	CPF    string    `json:"cpf"`
	Phone  string    `json:"phone"`
	Adress string    `json:"adress"`
	CEP    string    `json:"cep"`
	Birth  time.Time `json:"birth"`
}

func (dto *UserRequestDTO) Validate() error {
	if dto.Name == "" {
		return errors.New("nome é obrigatório")
	}

	if dto.Email == "" {
		return errors.New("email é obrigatório")
	}
	if !strings.Contains(dto.Email, "@") {
		return errors.New("email inválido")
	}

	if dto.Password == "" {
		return errors.New("senha é obrigatória")
	}

	if err := validators.ValidatePassword(dto.Password); err != nil {
		return err
	}

	if dto.CPF == "" {
		return errors.New("cpf é obrigatório")
	}

	if err := validators.ValidateCPF(dto.CPF); err != nil {
		return err
	}

	if dto.Phone == "" {
		return errors.New("telefone é obrigatório")
	}

	if dto.Adress == "" {
		return errors.New("endereço é obrigatório")
	}

	if dto.CEP == "" {
		return errors.New("cep é obrigatório")
	}

	if err := validators.ValidateCEP(dto.CEP); err != nil {
		return err
	}

	if dto.Birth.IsZero() {
		return errors.New("data de nascimento é obrigatória")
	}

	return nil
}

func (dto *UserRequestDTO) ToEntity() *entities.User {
	return &entities.User{
		Name:     dto.Name,
		Email:    dto.Email,
		Password: dto.Password,
		CPF:      dto.CPF,
		Phone:    dto.Phone,
		Adress:   dto.Adress,
		CEP:      dto.CEP,
		Birth:    dto.Birth,
	}
}

type UserUpdateDTO struct {
	Name     *string `json:"name"`
	Email    *string `json:"email"`
	Password *string `json:"password"`

	CPF    *string    `json:"cpf"`
	Phone  *string    `json:"phone"`
	Adress *string    `json:"adress"`
	CEP    *string    `json:"cep"`
	Birth  *time.Time `json:"birth"`
}

func (dto *UserUpdateDTO) Validate() error {
	if dto.Name != nil && *dto.Name == "" {
		return errors.New("nome é obrigatório")
	}

	if dto.Email != nil && *dto.Email == "" {
		return errors.New("email é obrigatório")
	}

	if dto.Email != nil && !strings.Contains(*dto.Email, "@") {
		return errors.New("email inválido")
	}

	if dto.Password != nil && *dto.Password == "" {
		return errors.New("senha é obrigatória")
	}

	if err := validators.ValidatePassword(*dto.Password); err != nil {
		return err
	}

	if dto.CPF != nil && *dto.CPF == "" {
		return errors.New("cpf é obrigatório")
	}

	if err := validators.ValidateCPF(*dto.CPF); err != nil {
		return err
	}

	if dto.Phone != nil && *dto.Phone == "" {
		return errors.New("telefone é obrigatório")
	}

	if dto.Adress != nil && *dto.Adress == "" {
		return errors.New("endereço é obrigatório")
	}

	if dto.CEP != nil && *dto.CEP == "" {
		return errors.New("cep é obrigatório")
	}

	if err := validators.ValidateCEP(*dto.CEP); err != nil {
		return err
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

	if dto.Adress != nil {
		user.Adress = *dto.Adress
	}

	if dto.CEP != nil {
		user.CEP = *dto.CEP
	}

	if dto.Birth != nil {
		user.Birth = *dto.Birth
	}

	return &user
}

type UserResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Name  string       `json:"name"`
	Email string       `json:"email"`
	Roles []types.Role `json:"roles"`

	CPF       string `json:"cpf"`
	Phone     string `json:"phone"`
	Adress    string `json:"adress"`
	CEP       string `json:"cep"`
	Birth     string `json:"birth"`
	AvatarURL string `json:"avatar_url"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToUserResponseDTO(entity *entities.User) *UserResponseDTO {
	return &UserResponseDTO{
		ID:        entity.ID,
		Name:      entity.Name,
		Email:     entity.Email,
		Roles:     entity.Roles,
		CPF:       entity.CPF,
		Phone:     entity.Phone,
		Adress:    entity.Adress,
		CEP:       entity.CEP,
		Birth:     entity.Birth.Format("02/01/2006"),
		AvatarURL: entity.AvatarURL,
		CreatedAt: entity.CreatedAt,
		UpdatedAt: entity.UpdatedAt,
	}
}
