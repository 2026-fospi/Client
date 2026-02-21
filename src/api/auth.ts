import { request } from './http';

export const ACCESS_TOKEN_KEY = 'fospi_access_token';
export const ROOM_CODE_KEY = 'fospi_room_code';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export interface CreateRoomRequest {
  title: string;
  discord_user_id?: string | null;
  penalties?: string[];
  start_date?: string | null;
  end_date?: string | null;
}

export interface CreateRoomResponse {
  room_code: string;
  start_date?: string | null;
  end_date?: string | null;
  penalties: string[];
}

export interface JoinRoomRequest {
  room_code: string;
  discord_user_id?: string | null;
}

export interface JoinRoomResponse {
  detail: string;
  room_code: string;
  start_date?: string | null;
  end_date?: string | null;
  penalties: string[];
}

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function register(payload: RegisterRequest): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function saveAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveRoomCode(roomCode: string): void {
  localStorage.setItem(ROOM_CODE_KEY, roomCode);
}

export function getRoomCode(): string | null {
  return localStorage.getItem(ROOM_CODE_KEY);
}

function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createRoom(payload: CreateRoomRequest): Promise<CreateRoomResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  return request<CreateRoomResponse>('/api/auth/create-room', {
    method: 'POST',
    headers: authHeader(token),
    body: payload,
  });
}

export async function joinRoom(payload: JoinRoomRequest): Promise<JoinRoomResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  return request<JoinRoomResponse>('/api/auth/join-room', {
    method: 'POST',
    headers: authHeader(token),
    body: payload,
  });
}
