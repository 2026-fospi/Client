import { request } from './http';

export interface RoomInfoResponse {
  room_code: string;
  title: string;
  guild_id?: string | null;
  announce_channel_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  member_count: number;
}

export async function listRooms(): Promise<RoomInfoResponse[]> {
  return request<RoomInfoResponse[]>('/api/rooms', {
    method: 'GET',
  });
}
