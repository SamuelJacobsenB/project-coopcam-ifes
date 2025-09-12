package types

import "errors"

type Period string

const (
	PeriodMorning   Period = "morning"
	PeriodAfternoon Period = "afternoon"
)

func ValidatePeriod(period Period) error {
	switch period {
	case PeriodMorning, PeriodAfternoon:
		return nil
	default:
		return errors.New("período inválido")
	}
}

