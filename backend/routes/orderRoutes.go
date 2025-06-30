package routes

import (
	"github.com/gofiber/fiber/v2"
	orderControllers "order-management-system/controllers"
)

func OrderRoutes(app *fiber.App) {
	app.Post("/orders", orderControllers.CreateOrder)
	app.Get("/orders", orderControllers.GetOrders)
	app.Put("/orders/:id", orderControllers.EditOrder)
}
