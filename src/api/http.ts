export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function request<T>(
  path: string,
  options: {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: unknown;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;

  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  }

  return (await res.json()) as T;
}
