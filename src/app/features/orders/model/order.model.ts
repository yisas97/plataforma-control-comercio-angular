export interface OrderItem {
  productId: number;
  productName: string;
  producerId: number;
  producerName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  userId: number;
  shippingAddress: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
}
