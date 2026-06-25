<template>
  <div class="mx-auto max-w-sm">
    <div class="card p-6">
      <h1 class="mb-1 text-2xl font-bold text-brand">ساخت حساب</h1>
      <p class="mb-6 text-sm text-gray-500">به Vibe بپیوند</p>

      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1 block text-sm font-medium">نام نمایشی</label>
          <input v-model="displayName" class="input">
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">نام کاربری</label>
          <input v-model="username" class="input" required>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">ایمیل</label>
          <input v-model="email" type="email" class="input" required>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">رمز عبور</label>
          <input v-model="password" type="password" class="input" minlength="6" required>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'در حال ساخت…' : 'ثبت‌نام' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-500">
        قبلاً ثبت‌نام کردی؟
        <NuxtLink to="/login" class="font-medium text-brand">ورود</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AuthUser } from '~/composables/useAuth';

const { setSession } = useAuth();

const displayName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await $apiFetch<{ accessToken: string; user: AuthUser }>(
      '/auth/register',
      {
        method: 'POST',
        body: {
          username: username.value,
          email: email.value,
          password: password.value,
          displayName: displayName.value || undefined,
        },
      },
    );
    setSession(res.accessToken, res.user);
    await navigateTo('/');
  } catch (e: unknown) {
    error.value = extractError(e) || 'ثبت‌نام ناموفق بود';
  } finally {
    loading.value = false;
  }
};
</script>
