export interface PaymentMethod {
  id: string;
  name: string;
}

export interface PaymentInfo {
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}
