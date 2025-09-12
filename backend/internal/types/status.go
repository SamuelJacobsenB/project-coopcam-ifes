package types

import "errors"

type Status string

const (
	Unstarted Status = "unstarted"
	Started   Status = "started"
	Finished  Status = "finished"
)

func ValidateStatus(status Status) error {
	switch status {
	case Unstarted, Started, Finished:
		return nil
	default:
		return errors.New("status invalido")
	}
}

