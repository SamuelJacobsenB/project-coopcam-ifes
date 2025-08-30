package user

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{service}
}

func (handler *UserHandler) FindAll(ctx *gin.Context) {
	users, err := handler.service.FindAll()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	usersResponse := make([]UserResponseDTO, len(users))
	for i, user := range users {
		usersResponse[i] = *user.ToResponseDTO()
	}

	ctx.JSON(200, usersResponse)
}

func (handler *UserHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	user, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, user.ToResponseDTO())
}

func (handler *UserHandler) Create(ctx *gin.Context) {
	var userRequest UserRequestDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := userRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user := userRequest.ToEntity()
	if err := handler.service.Create(user); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, user.ToResponseDTO())
}

func (handler *UserHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var userRequest UserRequestDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := userRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user := userRequest.ToEntity()
	user.ID = id
	if err := handler.service.Update(user); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, user.ToResponseDTO())
}

func (handler *UserHandler) UpdateAvatar(ctx *gin.Context) {
	// TODO
}

func (handler *UserHandler) PromoteToCoordinator(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.PromoteToCoordinator(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) DemoteFromCoordinator(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.DemoteFromCoordinator(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
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
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) DemoteFromAdmin(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.DemoteFromAdmin(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
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
