import { getAccessToken } from './auth';
import { request } from './http';

export interface AssetHolding {
  stock_user_id: number;
  stock_user_name: string;
  quantity: number;
  avg_buy_price: string;
  current_price: string;
  total_value: string;
}

export interface MyAssetsResponse {
  cash: string;
  holdings: AssetHolding[];
  total_asset: string;
}

function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyAssets(): Promise<MyAssetsResponse> {
  const token = getAccessToken();
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }

  return request<MyAssetsResponse>('/api/assets/me', {
    method: 'GET',
    headers: authHeader(token),
  });
}
