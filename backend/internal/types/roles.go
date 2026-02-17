package types

import "slices"

const (
	RoleAdmin       string = "admin"
	RoleCoordinator string = "coordinator"
	RoleUser        string = "user"
)

func ValidateRole(role string) bool {
	switch role {
	case RoleAdmin, RoleCoordinator, RoleUser:
		return true
	default:
		return false
	}
}

func HasRole(userRole string, allowedRoles []string) bool {
	return slices.Contains(allowedRoles, userRole)
}
