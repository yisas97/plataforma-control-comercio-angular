export interface ProducerSalesStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  todayRevenue: number;
  thisWeekOrders: number;
  thisWeekRevenue: number;
  thisMonthOrders: number;
  thisMonthRevenue: number;
  bestSellingProduct: string;
  bestSellingProductQuantity: number;
  lastOrderDate: string;
}
