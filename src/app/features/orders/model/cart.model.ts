export interface CartItem {
  productId: number;
  productName: string;
  producerId: number;
  producerName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}
