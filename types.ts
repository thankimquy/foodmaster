
export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  foodId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  date: string;
  isDelivered: boolean;
}

export type ViewState = 'dashboard' | 'menu' | 'orders';

export interface AIInsight {
  summary: string;
  recommendations: string[];
}
