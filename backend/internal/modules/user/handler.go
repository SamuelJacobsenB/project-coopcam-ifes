package user

import (
	"fmt"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{service}
}

func (handler *UserHandler) FindMany(ctx *gin.Context) {
	namePrefix := ctx.Query("name")

	users, err := handler.service.FindMany(namePrefix)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar usuários"})
		return
	}

	usersResponse := make([]dtos.UserResponseDTO, len(users))
	for i, user := range users {
		usersResponse[i] = *dtos.ToUserResponseDTO(&user)
	}

	ctx.JSON(200, usersResponse)
}

func (handler *UserHandler) FindOwn(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	user, err := handler.service.FindByID(userID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar usuário"})
		return
	}

	ctx.JSON(200, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if id != userID {
		ifUserIsAdmin, err := handler.service.FindByID(userID)
		if !types.HasRole(ifUserIsAdmin.Role, []string{types.RoleAdmin, types.RoleDriver}) || err != nil {
			ctx.JSON(403, gin.H{"error": "usuário não autorizado"})
			return
		}
	}

	user, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar usuário"})
		return
	}

	ctx.JSON(200, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) Create(ctx *gin.Context) {
	var userRequest dtos.UserRequestDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		fmt.Println(err)
		ctx.JSON(400, gin.H{"error": "erro ao criar usuário"})
		return
	}

	if err := userRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "erro ao criar usuário"})
		return
	}

	user := userRequest.ToEntity()
	if err := handler.service.Create(user); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao criar usuário"})
		return
	}

	ctx.JSON(201, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var userRequest dtos.UserUpdateDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "erro ao atualizar usuário"})
		return
	}

	if err := userRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "erro ao atualizar usuário"})
		return
	}

	user := userRequest.ToEntity()
	user.ID = id
	if err := handler.service.Update(user); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao atualizar usuário"})
		return
	}

	ctx.JSON(200, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) PromoteToDriver(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.PromoteToDriver(id); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao promover para motorista"})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) PromoteToAdmin(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.PromoteToAdmin(id); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao promover para admin"})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) DemoteToUser(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.DemoteToUser(id); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao rebaixar para usuário"})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(204, nil)
}
