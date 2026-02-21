import { getAccessToken } from './auth';
import { request } from './http';

export interface PenaltyRankingItem {
  rank: number;
  user_id: number;
  name: string;
  cash: string;
  stock_value: string;
  total_asset: string;
  is_loser: boolean;
}

export interface PenaltiesLoserResponse {
  ranking: PenaltyRankingItem[];
  penalties: string[];
}

function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getPenaltiesLoser(): Promise<PenaltiesLoserResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }
  return request<PenaltiesLoserResponse>('/api/penalties/loser', {
    method: 'GET',
    headers: authHeader(token),
  });
}
