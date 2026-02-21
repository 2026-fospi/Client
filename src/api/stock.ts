import { getAccessToken } from './auth';
import { request } from './http';

/** 방 내 멤버 주식 목록 (GET /api/stocks/room/{room_code}) */
export interface RoomStockMember {
  user_id: number;
  name: string;
  current_price: string;
  prev_price: string;
  change_amount: string;
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

export interface StockLogItem {
  recorded_at: string;
  log_type: string;
  content: string;
  news_body: string;
  ai_score: number;
  change_amount: string;
  prev_price: string;
  new_price: string;
}

export async function getStocksByRoom(roomCode: string): Promise<RoomStockMember[]> {
  return request<RoomStockMember[]>(`/api/stocks/room/${encodeURIComponent(roomCode)}`, {
    method: 'GET',
  });
}

export interface StockHistoryPoint {
  price: string;
  recorded_at: string;
}

export interface StockDetailResponse {
  user_id: number;
  name: string;
  current_price: string;
  prev_price: string;
  change_amount: string;
  change_rate: number;
  high_price: string;
  low_price: string;
  total_shares: number;
  history: StockHistoryPoint[];
}

export async function getStockDetail(stockId: number): Promise<StockDetailResponse> {
  return request<StockDetailResponse>(`/api/stocks/${stockId}`, {
    method: 'GET',
  });
}

export async function getStockLogs(stockId: number): Promise<StockLogItem[]> {
  return request<StockLogItem[]>(`/api/stocks/by-stock/${stockId}/logs`, {
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
