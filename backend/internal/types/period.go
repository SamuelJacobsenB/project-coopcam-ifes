package types

import "errors"

type Period string

const (
	PeriodGo     Period = "go"
	PeriodReturn Period = "return"
)

func ValidatePeriod(period Period) error {
	switch period {
	case PeriodGo, PeriodReturn:
		return nil
	default:
		return errors.New("período inválido")
	}
}
