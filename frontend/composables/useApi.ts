import type { FetchOptions } from 'ofetch';

export async function $apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const config = useRuntimeConfig();
  const token = useState<string | null>('auth_token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`;
  }

  return $fetch<T>(path, {
    baseURL: config.public.apiBase,
    ...options,
    headers,
  } as FetchOptions) as Promise<T>;
}
