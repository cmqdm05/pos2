import { api } from '../api';
import { Sale } from '../../components/sales/types';

export interface CreateSaleRequest {
  store: string;
  items: Array<{
    product: string;
    quantity: number;
    modifiers: Array<{
      name: string;
      option: {
        name: string;
        price: number;
      };
    }>;
    discounts: Array<{
      name: string;
      type: 'percentage' | 'fixed';
      value: number;
    }>;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card';
}

export const saleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation<Sale, CreateSaleRequest>({
      query: (saleData) => ({
        url: 'sales',
        method: 'POST',
        body: saleData,
      }),
      invalidatesTags: ['Sales'],
    }),
    getSales: builder.query<Sale[], string>({
      query: (storeId) => `sales/${storeId}`,
      providesTags: ['Sales'],
    }),
  }),
});

export const {
  useCreateSaleMutation,
  useGetSalesQuery,
} = saleApi;