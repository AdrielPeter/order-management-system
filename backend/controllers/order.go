package controllers

import (
	"order-management-system/database"
	"order-management-system/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CreateOrder(c *fiber.Ctx) error {
	var order models.Order
	if err := c.BodyParser(&order); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	order.ID = uuid.New()
	var lastOrder models.Order
	database.DB.Order("control_number DESC").First(&lastOrder)

	order.ControlNumber = lastOrder.ControlNumber + 1
	order.State = "Pending"

	if err := database.DB.Create(&order).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error creating order on database"})
	}

	return c.JSON(order)
}

func GetOrders(c *fiber.Ctx) error {
	var orders []models.Order

	state := c.Query("state")
	controlNumber := c.Query("controlNumber")

	query := database.DB

	if state != "" {
		query = query.Where("state = ?", state)
	}

	if controlNumber != "" {
		query = query.Where("control_number = ?", controlNumber)
	}

	if err := query.Find(&orders).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error fetching orders"})
	}

	return c.JSON(orders)
}

func EditOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	var order models.Order

	if err := database.DB.First(&order, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
	}

	type UpdateOrderInput struct {
		State string `json:"state"`
	}

	var input UpdateOrderInput

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	if order.State == "Completed" {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot update a completed order"})
	}

	if order.State == "Pending" && input.State != "In Progress" {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot change status from Pending to anything other than In Progress"})
	}

	if order.State == "In Progress" && input.State != "Completed" {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot change status from In Progress to anything other than Completed"})
	}

	order.State = input.State

	if err := database.DB.Save(&order).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error updating order"})
	}

	return c.JSON(order)
}
