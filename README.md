# Order Management System

A simple order management system with a backend in Golang (Fiber) and a frontend in Next.js (React).

## Project Structure

`
order-management-system/
├── backend/          # API built with Go and Fiber
├── frontend/         # Interface built with Next.js and React
└── README.md
`

## Functionalities

### Backend (Go/Fiber)

- ✅ API REST using Fiber
- ✅ SQLite database with GORM
- ✅ Order CRUD operations
- ✅ Routes:
  - `GET /` - Status of API
  - `GET /orders` - Get all orders with optional filters
  - `POST /orders` - Create a new order
  - `PUT /orders/:id` - Edit a order

### Frontend (Next.js/React)

- ✅ Interface with Material-UI
- ✅ Order listing with filters
- ✅ Create new orders
- ✅ Update order status
- ✅ API integration

## How to execute

### 1. Backend

```bash
cd backend
go run main.go
```

The backend will be available at: `http://localhost:8080`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## How to testing

### 1. Verify if the api is working

Acesse: `http://localhost:8080/`
Will return: "API Order Management ok!"

### 2. Testing GET (List orders)

Open: `http://localhost:8080/orders`
Expected: JSON array of existing orders

### 3. Test POST (Create an order)

```bash
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderName": "Test Order"
  }'
```

### 4.  Use the Web Interface

1. Go to: `http://localhost:3000`
2. Click on "Register Order" to create a new order
3. Use the filters to search orders
4. Click on "Analyze" to update the order status

## Data Structure

### Model Order

`
{
  "id": "uuid-string",
  "controlNumber": 123,
  "state": "Pending|In Progress|Completed",
  "orderName": "Nome do Pedido"
}
`

### Order States

- `Pending`
- `In Progress`
- `Completed`

## Technologies Used

### Backend

Go – Main language
Fiber – Web framework
GORM – ORM for database
SQLite – Local database

### Frontend

Next.js 15 – React framework
React 19 – UI library
Material-UI (MUI) – Component library
TypeScript – Static typing

### Testing on Frontend

1. **Automated tests with Jest**
   - The frontend uses Jest for unit/component testing.
   - To run tests:
     `
     cd frontend
     npm run test
     `
   - Results will be displayed in the terminal.

### Backend Tests

1. **Automated tests with Go’s built-in testing package**
   - The backend uses testing, testify, and httptest to validate controllers and logic.
   - To run all backend tests:
     `
     cd backend
     go test ./...
     `
   - Results will be displayed in the terminal.
