import { request } from './http';

export interface UserInfoResponse {
  id: number;
  name: string;
  discord_user_id?: string | null;
}

export async function listUsers(): Promise<UserInfoResponse[]> {
  return request<UserInfoResponse[]>('/api/users', {
    method: 'GET',
  });
}
