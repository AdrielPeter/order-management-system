package main

import (
	"order-management-system/database"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2"
)

func main() {

	database.DatabaseInit()

	app := fiber.New()
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("API Order Management ok!")
	})

	app.Listen(":8080")
}
