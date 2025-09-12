package types

import "errors"

type Direction string

const (
	DirectionGo     Direction = "go"
	DirectionReturn Direction = "return"
)

func ValidateDirection(direction Direction) error {
	switch direction {
	case DirectionGo, DirectionReturn:
		return nil
	default:
		return errors.New("direção inválida")
	}
}

