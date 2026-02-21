import { request } from './http';

export interface StockListItem {
  user_id: number;
  name: string;
  current_price: string;
  prev_price: string;
  change_rate: number;
}

export async function getStocks(): Promise<StockListItem[]> {
  return request<StockListItem[]>('/api/stocks', {
    method: 'GET',
  });
}
