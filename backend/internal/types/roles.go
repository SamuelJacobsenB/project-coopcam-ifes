package types

import "slices"

const (
	RoleAdmin  string = "admin"
	RoleDriver string = "driver"
	RoleUser   string = "user"
)

func ValidateRole(role string) bool {
	switch role {
	case RoleAdmin, RoleDriver, RoleUser:
		return true
	default:
		return false
	}
}

func HasRole(userRole string, allowedRoles []string) bool {
	return slices.Contains(allowedRoles, userRole)
}
