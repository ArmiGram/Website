export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  displayName: string | null;
  avatarUrl: string | null;
}

const TOKEN_KEY = 'vibe_token';

export const useAuth = () => {
  const token = useState<string | null>('auth_token', () => null);
  const user = useState<AuthUser | null>('auth_user', () => null);

  const setSession = (accessToken: string, authUser: AuthUser) => {
    token.value = accessToken;
    user.value = authUser;
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
  };

  const clearSession = () => {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const loadToken = () => {
    if (import.meta.client && !token.value) {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) token.value = stored;
    }
  };

  const fetchMe = async () => {
    if (!token.value) return;
    try {
      user.value = await $apiFetch<AuthUser>('/auth/me');
    } catch {
      clearSession();
    }
  };

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  return {
    token,
    user,
    isLoggedIn,
    setSession,
    clearSession,
    loadToken,
    fetchMe,
  };
};
