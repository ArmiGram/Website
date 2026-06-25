<template>
  <div class="mx-auto max-w-sm">
    <div class="card p-6">
      <h1 class="mb-1 text-2xl font-bold text-brand">ورود به Vibe</h1>
      <p class="mb-6 text-sm text-gray-500">با نام کاربری یا ایمیل وارد شو</p>

      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1 block text-sm font-medium">نام کاربری یا ایمیل</label>
          <input v-model="identifier" class="input" autocomplete="username" required>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">رمز عبور</label>
          <input v-model="password" type="password" class="input" autocomplete="current-password" required>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'در حال ورود…' : 'ورود' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-500">
        حساب نداری؟
        <NuxtLink to="/register" class="font-medium text-brand">ثبت‌نام</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuthUser } from '~/composables/useAuth';

const { setSession } = useAuth();
const route = useRoute();

const identifier = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await $apiFetch<{ accessToken: string; user: AuthUser }>(
      '/auth/login',
      {
        method: 'POST',
        body: { identifier: identifier.value, password: password.value },
      },
    );
    setSession(res.accessToken, res.user);
    const redirect = (route.query.redirect as string) || '/';
    await navigateTo(redirect);
  } catch (e: unknown) {
    error.value = extractError(e) || 'ورود ناموفق بود';
  } finally {
    loading.value = false;
  }
};
</script>
