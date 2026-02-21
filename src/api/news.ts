import { getAccessToken } from './auth';
import { request } from './http';

export interface NewsCreateRequest {
  event_description: string;
  room_code?: string | null;
  related_user_id?: number | null;
}

export interface NewsResponse {
  id: number;
  title: string;
  content: string;
  related_user_id: number | null;
  created_at: string;
}

function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getNews(): Promise<NewsResponse[]> {
  return request<NewsResponse[]>('/api/news', {
    method: 'GET',
  });
}

export async function createNews(payload: NewsCreateRequest): Promise<NewsResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인 요청 성공 후 저장된 access token이 없습니다.');
  }

  return request<NewsResponse>('/api/news', {
    method: 'POST',
    headers: authHeader(token),
    body: payload,
  });
}
