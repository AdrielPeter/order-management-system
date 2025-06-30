import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalEditOrder from './ModalEditOrder';
import { OrderTypes } from '@/types/orderTypes';

const mockOnClose = jest.fn();
const mockUpdate = jest.fn();
const order: OrderTypes = {
  id: '1',
  controlNumber: 123,
  orderName: 'Pedido Teste',
  state: 'Pending',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ModalEditOrder', () => {
  it('should render correctly when open', () => {
    render(<ModalEditOrder open={true} onClose={mockOnClose} order={order} update={mockUpdate} />);
    expect(screen.getByText('Analyze Order')).toBeInTheDocument();
    expect(screen.getByText('#123 -')).toBeInTheDocument();
    expect(screen.getByText('Pedido Teste')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('should call onClose when clicking Cancel', async () => {
    render(<ModalEditOrder open={true} onClose={mockOnClose} order={order} update={mockUpdate} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should allow selecting a new status', async () => {
    render(<ModalEditOrder open={true} onClose={mockOnClose} order={order} update={mockUpdate} />);
    const select = screen.getByLabelText('Status');
    await userEvent.click(select);
    await userEvent.click(screen.getByText('In Progress'));
    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
  });
}); 