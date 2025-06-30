import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalCreateOrder from './ModalCreateOrder';

const mockOnClose = jest.fn();
const mockUpdate = jest.fn();

describe('ModalCreateOrder', () => {
  it('should render correctly when open', () => {
    render(<ModalCreateOrder open={true} onClose={mockOnClose} update={mockUpdate} />);
    expect(screen.getByText('Create Order')).toBeInTheDocument();
    expect(screen.getByLabelText('Identification')).toBeInTheDocument();
    expect(screen.getByLabelText('Order Status')).toBeInTheDocument();
  });

  it('should call onClose when clicking Cancel', () => {
    render(<ModalCreateOrder open={true} onClose={mockOnClose} update={mockUpdate} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should allow typing in the Identification field', () => {
    render(<ModalCreateOrder open={true} onClose={mockOnClose} update={mockUpdate} />);
    const input = screen.getByLabelText('Identification');
    fireEvent.change(input, { target: { value: 'Pedido Teste' } });
    expect(input).toHaveValue('Pedido Teste');
  });
}); 