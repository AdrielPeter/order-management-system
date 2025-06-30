type OrderState = 'Pending' | 'In Progress' | 'Completed';

export type OrderTypes = {
  id?: string;
  controlNumber?: number;
  orderName: string;
  state: OrderState;
};

export const InitialValuesOrder : OrderTypes = {
  orderName: '',
  state: 'Pending',
};