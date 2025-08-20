package types

import (
	"errors"
	"slices"

	"github.com/lib/pq"
)

type DaySchedule struct {
	MorningDays   pq.Int64Array `gorm:"type:integer[];default:'{}'"`
	AfternoonDays pq.Int64Array `gorm:"type:integer[];default:'{}'"`
}

func ValidateDaySchedule(schedule *DaySchedule) error {
	var validatedMorningDays pq.Int64Array
	var validatedAfternoonDays pq.Int64Array

	for _, day := range schedule.MorningDays {
		if slices.Contains(validatedMorningDays, day) {
			return errors.New("dia da manhã duplicado")
		}

		if day < 0 || day > 6 {
			return errors.New("dia da manhã inválido")
		}

		validatedMorningDays = append(validatedMorningDays, day)
	}

	for _, day := range schedule.AfternoonDays {
		if slices.Contains(validatedAfternoonDays, day) {
			return errors.New("dia da tarde duplicado")
		}

		if day < 0 || day > 6 {
			return errors.New("dia da tarde inválido")
		}

		validatedAfternoonDays = append(validatedAfternoonDays, day)
	}

	schedule.MorningDays = validatedMorningDays
	schedule.AfternoonDays = validatedAfternoonDays

	return nil
}
