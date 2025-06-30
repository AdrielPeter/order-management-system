package models

import "github.com/google/uuid"

type Order struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	ControlNumber float64   `json:"controlNumber" gorm:"uniqueIndex"`
	State         string    `json:"state"`
	OrderName     string    `json:"orderName"`
}
