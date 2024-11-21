import { Product } from '../../store/services/productService';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedModifiers: Array<{
    name: string;
    option: {
      name: string;
      price: number;
    };
  }>;
  selectedDiscounts: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
  }>;
}

export interface Sale {
  _id: string;
  store: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
  status: 'completed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}