package utils

func ValidateMonth(month int) bool {
	if month < 1 || month > 12 {
		return false
	}

	return true
}
