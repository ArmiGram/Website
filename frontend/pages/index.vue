<template>
  <div>
    <div v-if="isLoggedIn" class="mb-4 flex gap-2">
      <button
        class="px-3 py-1.5 text-sm font-medium"
        :class="tab === 'explore' ? 'text-brand border-b-2 border-brand' : 'text-gray-500'"
        @click="switchTab('explore')"
      >
        کاوش
      </button>
      <button
        class="px-3 py-1.5 text-sm font-medium"
        :class="tab === 'following' ? 'text-brand border-b-2 border-brand' : 'text-gray-500'"
        @click="switchTab('following')"
      >
        دنبال‌شده‌ها
      </button>
    </div>

    <div v-if="pending && posts.length === 0" class="py-10 text-center text-gray-400">
      در حال بارگذاری…
    </div>

    <div v-else-if="posts.length === 0" class="card p-10 text-center text-gray-500">
      هنوز پستی نیست.
      <NuxtLink v-if="isLoggedIn" to="/upload" class="text-brand">اولین پست را بساز!</NuxtLink>
    </div>

    <div class="space-y-6">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @toggle-like="toggleLike"
      />
    </div>

    <div v-if="nextCursor" class="mt-6 text-center">
      <button class="btn-ghost" :disabled="pending" @click="loadMore">بیشتر</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedResponse, Post } from '~/types';

const { isLoggedIn } = useAuth();

const tab = ref<'explore' | 'following'>('explore');
const posts = ref<Post[]>([]);
const nextCursor = ref<string | null>(null);
const pending = ref(false);

const endpoint = computed(() =>
  tab.value === 'following' ? '/posts/following' : '/posts',
);

const load = async (cursor?: string) => {
  pending.value = true;
  try {
    const query = cursor ? `?cursor=${cursor}` : '';
    const res = await $apiFetch<FeedResponse>(`${endpoint.value}${query}`);
    if (cursor) {
      posts.value.push(...res.items);
    } else {
      posts.value = res.items;
    }
    nextCursor.value = res.nextCursor;
  } finally {
    pending.value = false;
  }
};

const loadMore = () => nextCursor.value && load(nextCursor.value);

const switchTab = async (next: 'explore' | 'following') => {
  if (tab.value === next) return;
  tab.value = next;
  posts.value = [];
  nextCursor.value = null;
  await load();
};

const toggleLike = async (post: Post) => {
  if (!isLoggedIn.value) {
    await navigateTo('/login');
    return;
  }
  const liked = post.likedByMe;
  post.likedByMe = !liked;
  post.likeCount += liked ? -1 : 1;
  try {
    await $apiFetch(`/posts/${post.id}/like`, {
      method: liked ? 'DELETE' : 'POST',
    });
  } catch {
    post.likedByMe = liked;
    post.likeCount += liked ? 1 : -1;
  }
};

onMounted(() => load());
</script>
