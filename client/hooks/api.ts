export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

export type ApiListResponse<T> = {
  message?: string;
  items?: T[];
  data?: T[];
};

export type ApiItemResponse<T> = {
  message?: string;
  data?: T;
};

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_access_token');
}

function createHeaders(auth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getAdminToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function apiGet<T>(path: string, auth = false): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: createHeaders(auth),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  auth = false,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: createHeaders(auth),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`POST ${path} failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  auth = false,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: createHeaders(auth),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`PATCH ${path} failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiDelete<T>(path: string, auth = false): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: createHeaders(auth),
  });

  if (!response.ok) {
    throw new Error(`DELETE ${path} failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

