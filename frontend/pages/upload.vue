<template>
  <div class="mx-auto max-w-lg">
    <div class="card p-6">
      <h1 class="mb-6 text-2xl font-bold">پست جدید</h1>

      <form class="space-y-4" @submit.prevent="submit">
        <div
          class="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-4 text-center hover:border-brand"
          @click="fileInput?.click()"
        >
          <template v-if="previewUrl">
            <video v-if="isVideo" :src="previewUrl" class="max-h-72 rounded-lg" controls />
            <img v-else :src="previewUrl" class="max-h-72 rounded-lg" alt="preview">
            <p class="mt-2 text-xs text-gray-500">برای تغییر کلیک کن</p>
          </template>
          <template v-else>
            <p class="text-gray-500">عکس یا ویدیو انتخاب کن</p>
            <p class="mt-1 text-xs text-gray-400">JPG, PNG, GIF, MP4, WebM (حداکثر ۱۰۰MB)</p>
          </template>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*,video/*"
          class="hidden"
          @change="onFileChange"
        >

        <div>
          <label class="mb-1 block text-sm font-medium">کپشن</label>
          <textarea v-model="caption" rows="3" class="input" placeholder="یه چیزی بنویس…" />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button class="btn-primary w-full" :disabled="loading || !file">
          {{ loading ? 'در حال انتشار…' : 'انتشار' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types';

definePageMeta({ middleware: 'auth' });

const { token } = useAuth();
const config = useRuntimeConfig();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const previewUrl = ref('');
const caption = ref('');
const loading = ref(false);
const error = ref('');

const isVideo = computed(() => file.value?.type.startsWith('video/'));

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selected = target.files?.[0];
  if (!selected) return;
  file.value = selected;
  previewUrl.value = URL.createObjectURL(selected);
};

const submit = async () => {
  if (!file.value) return;
  loading.value = true;
  error.value = '';
  try {
    const form = new FormData();
    form.append('file', file.value);
    const uploaded = await $fetch<{ url: string; mediaType: string }>(
      '/media/upload',
      {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: form,
        headers: { Authorization: `Bearer ${token.value}` },
      },
    );

    const post = await $apiFetch<Post>('/posts', {
      method: 'POST',
      body: {
        caption: caption.value || undefined,
        mediaUrl: uploaded.url,
        mediaType: uploaded.mediaType,
      },
    });

    await navigateTo(`/post/${post.id}`);
  } catch (e: unknown) {
    error.value = extractError(e) || 'انتشار ناموفق بود';
  } finally {
    loading.value = false;
  }
};
</script>
