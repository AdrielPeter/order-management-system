package tests

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"order-management-system/controllers"
	"order-management-system/database"
	"order-management-system/models"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type OrderControllerTestSuite struct {
	suite.Suite
	app *fiber.App
}

func (suite *OrderControllerTestSuite) SetupSuite() {
	database.DatabaseInit()

	suite.app = fiber.New()

	suite.app.Post("/orders", controllers.CreateOrder)
	suite.app.Get("/orders", controllers.GetOrders)
	suite.app.Put("/orders/:id", controllers.EditOrder)
}

func (suite *OrderControllerTestSuite) TearDownSuite() {
	database.DB.Exec("DELETE FROM orders")
}

func (suite *OrderControllerTestSuite) SetupTest() {
	database.DB.Exec("DELETE FROM orders")
}

func (suite *OrderControllerTestSuite) TestCreateOrder() {
	orderData := models.Order{
		OrderName: "Test Order",
	}

	jsonData, _ := json.Marshal(orderData)
	req := httptest.NewRequest("POST", "/orders", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	resp, err := suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 200, resp.StatusCode)

	var createdOrder models.Order
	json.NewDecoder(resp.Body).Decode(&createdOrder)
	assert.NotEmpty(suite.T(), createdOrder.ID)
	assert.Equal(suite.T(), "Test Order", createdOrder.OrderName)
	assert.Equal(suite.T(), "Pending", createdOrder.State)
	assert.Greater(suite.T(), createdOrder.ControlNumber, float64(0))
}

func (suite *OrderControllerTestSuite) TestCreateOrderInvalidData() {
	req := httptest.NewRequest("POST", "/orders", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	resp, err := suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 400, resp.StatusCode)
}

func (suite *OrderControllerTestSuite) TestGetOrders() {
	orders := []models.Order{
		{OrderName: "Order 1", State: "Pending"},
		{OrderName: "Order 2", State: "In Progress"},
		{OrderName: "Order 3", State: "Completed"},
	}

	for _, orderData := range orders {
		jsonData, _ := json.Marshal(orderData)
		req := httptest.NewRequest("POST", "/orders", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		suite.app.Test(req)
	}

	req := httptest.NewRequest("GET", "/orders", nil)
	resp, err := suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 200, resp.StatusCode)

	var allOrders []models.Order
	json.NewDecoder(resp.Body).Decode(&allOrders)
	assert.GreaterOrEqual(suite.T(), len(allOrders), 3)

	req = httptest.NewRequest("GET", "/orders?state=Pending", nil)
	resp, err = suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 200, resp.StatusCode)

	var pendingOrders []models.Order
	json.NewDecoder(resp.Body).Decode(&pendingOrders)
	for _, order := range pendingOrders {
		assert.Equal(suite.T(), "Pending", order.State)
	}
}

func (suite *OrderControllerTestSuite) TestEditOrder() {
	orderData := models.Order{
		OrderName: "Order to Edit",
	}
	jsonData, _ := json.Marshal(orderData)
	req := httptest.NewRequest("POST", "/orders", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := suite.app.Test(req)

	var createdOrder models.Order
	json.NewDecoder(resp.Body).Decode(&createdOrder)

	updateData := map[string]string{"state": "In Progress"}
	jsonData, _ = json.Marshal(updateData)

	req = httptest.NewRequest("PUT", "/orders/"+createdOrder.ID.String(), bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	resp, err := suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 200, resp.StatusCode)

	var updatedOrder models.Order
	json.NewDecoder(resp.Body).Decode(&updatedOrder)
	assert.Equal(suite.T(), "In Progress", updatedOrder.State)

	completedOrderData := models.Order{
		OrderName: "Completed Order",
	}
	jsonData, _ = json.Marshal(completedOrderData)
	req = httptest.NewRequest("POST", "/orders", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = suite.app.Test(req)

	var completedOrder models.Order
	json.NewDecoder(resp.Body).Decode(&completedOrder)

	updateData = map[string]string{"state": "In Progress"}
	jsonData, _ = json.Marshal(updateData)
	req = httptest.NewRequest("PUT", "/orders/"+completedOrder.ID.String(), bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	suite.app.Test(req)

	updateData = map[string]string{"state": "Completed"}
	jsonData, _ = json.Marshal(updateData)
	req = httptest.NewRequest("PUT", "/orders/"+completedOrder.ID.String(), bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	suite.app.Test(req)

	updateData = map[string]string{"state": "In Progress"}
	jsonData, _ = json.Marshal(updateData)
	req = httptest.NewRequest("PUT", "/orders/"+completedOrder.ID.String(), bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	resp, err = suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 400, resp.StatusCode)

	req = httptest.NewRequest("PUT", "/orders/nonexistent-id", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	resp, err = suite.app.Test(req)
	assert.NoError(suite.T(), err)
	assert.Equal(suite.T(), 404, resp.StatusCode)
}

func TestOrderControllerSuite(t *testing.T) {
	suite.Run(t, new(OrderControllerTestSuite))
}
