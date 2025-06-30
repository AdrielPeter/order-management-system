import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OrdersPage from './OrdersPage'
import * as getOrdersService from '@/services/getOrders'
import userEvent from '@testing-library/user-event'

jest.mock('@/services/getOrders')
const getOrdersMock = getOrdersService.getOrders as jest.Mock

const mockOrders = [
  { id: '1', controlNumber: 101, orderName: 'Pedido 1', state: 'Pending' },
  { id: '2', controlNumber: 102, orderName: 'Pedido 2', state: 'In Progress' },
  { id: '3', controlNumber: 103, orderName: 'Pedido 3', state: 'Completed' },
]

describe('OrdersPage', () => {
  beforeEach(() => {
    getOrdersMock.mockResolvedValue(mockOrders)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the page and display the orders', async () => {
    render(<OrdersPage />)
    expect(screen.getByText('Order Management')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('#101')).toBeInTheDocument()
      expect(screen.getByText('#102')).toBeInTheDocument()
      expect(screen.getByText('#103')).toBeInTheDocument()
    })
  })

  it('should filter by control number', async () => {
    render(<OrdersPage />)
    const input = screen.getByLabelText('Control Number')
    fireEvent.change(input, { target: { value: '101' } })
    await waitFor(() => {
      expect(screen.getByText('#101')).toBeInTheDocument()
      expect(screen.queryByText('#102')).not.toBeInTheDocument()
      expect(screen.queryByText('#103')).not.toBeInTheDocument()
    })
  })

  it('should filter by status', async () => {
    render(<OrdersPage />)
    const select = screen.getByLabelText('Order State')
    await userEvent.click(select)
    const completedOption = screen.getByRole('option', { name: 'Completed' })
    await userEvent.click(completedOption)
    await waitFor(() => {
      expect(screen.getByText('#103')).toBeInTheDocument()
      expect(screen.queryByText('#101')).not.toBeInTheDocument()
      expect(screen.queryByText('#102')).not.toBeInTheDocument()
    })
  })

  it('should show a message when there are no orders', async () => {
    getOrdersMock.mockResolvedValue([])
    render(<OrdersPage />)
    await waitFor(() => {
      expect(screen.getByText('No orders found.')).toBeInTheDocument()
    })
  })
}) 