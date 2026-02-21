import { getAccessToken } from './auth';
import { request } from './http';

export interface StockListItem {
  user_id: number;
  name: string;
  current_price: string;
  prev_price: string;
  change_rate: number;
}

export interface BuyStockRequest {
  quantity: number;
  stock_user_id: number;
}

export interface BuyStockResponse {
  id: number;
  order_type: string;
  quantity: number;
  price: string;
  created_at: string;
}

function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getStocks(): Promise<StockListItem[]> {
  return request<StockListItem[]>('/api/stocks', {
    method: 'GET',
  });
}

export interface SellStockRequest {
  quantity: number;
  stock_user_id: number;
}

export interface SellStockResponse {
  id: number;
  order_type: string;
  quantity: number;
  price: string;
  created_at: string;
}

export async function buyStock(payload: BuyStockRequest): Promise<BuyStockResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  return request<BuyStockResponse>('/api/stocks/buy', {
    method: 'POST',
    headers: authHeader(token),
    body: payload,
  });
}

export async function sellStock(payload: SellStockRequest): Promise<SellStockResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  return request<SellStockResponse>('/api/stocks/sell', {
    method: 'POST',
    headers: authHeader(token),
    body: payload,
  });
}
