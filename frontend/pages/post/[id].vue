<template>
  <div>
    <div v-if="pending" class="py-10 text-center text-gray-400">در حال بارگذاری…</div>

    <div v-else-if="post" class="space-y-4">
      <PostCard :post="post" @toggle-like="toggleLike" />

      <div class="card p-4">
        <h2 class="mb-3 font-semibold">کامنت‌ها ({{ comments.length }})</h2>

        <form v-if="isLoggedIn" class="mb-4 flex gap-2" @submit.prevent="addComment">
          <input v-model="newComment" class="input" placeholder="کامنت بنویس…" required>
          <button class="btn-primary" :disabled="posting">ارسال</button>
        </form>
        <p v-else class="mb-4 text-sm text-gray-500">
          برای کامنت گذاشتن <NuxtLink to="/login" class="text-brand">وارد شو</NuxtLink>
        </p>

        <div v-if="comments.length === 0" class="text-sm text-gray-400">
          هنوز کامنتی نیست.
        </div>

        <ul class="space-y-3">
          <li v-for="c in comments" :key="c.id" class="flex gap-3">
            <img
              :src="c.author.avatarUrl || fallbackAvatar(c.author.username)"
              class="h-8 w-8 rounded-full object-cover"
              alt="avatar"
            >
            <div class="flex-1">
              <p class="text-sm">
                <NuxtLink :to="`/u/${c.author.username}`" class="font-semibold">
                  {{ c.author.username }}
                </NuxtLink>
                <span class="ml-1">{{ c.text }}</span>
              </p>
            </div>
            <button
              v-if="user && user.id === c.author.id"
              class="text-xs text-gray-400 hover:text-red-500"
              @click="removeComment(c.id)"
            >
              حذف
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="card p-10 text-center text-gray-500">پست پیدا نشد.</div>
  </div>
</template>

<script setup lang="ts">
import type { Comment, Post } from '~/types';

const route = useRoute();
const { isLoggedIn, user } = useAuth();
const id = route.params.id as string;

const post = ref<Post | null>(null);
const comments = ref<Comment[]>([]);
const newComment = ref('');
const pending = ref(true);
const posting = ref(false);

const fallbackAvatar = (username: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

const load = async () => {
  pending.value = true;
  try {
    const [p, c] = await Promise.all([
      $apiFetch<Post>(`/posts/${id}`),
      $apiFetch<Comment[]>(`/posts/${id}/comments`),
    ]);
    post.value = p;
    comments.value = c;
  } catch {
    post.value = null;
  } finally {
    pending.value = false;
  }
};

const addComment = async () => {
  posting.value = true;
  try {
    const created = await $apiFetch<Comment>(`/posts/${id}/comments`, {
      method: 'POST',
      body: { text: newComment.value },
    });
    comments.value.push(created);
    newComment.value = '';
    if (post.value) post.value.commentCount += 1;
  } finally {
    posting.value = false;
  }
};

const removeComment = async (commentId: string) => {
  await $apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
  comments.value = comments.value.filter((c) => c.id !== commentId);
  if (post.value) post.value.commentCount -= 1;
};

const toggleLike = async (p: Post) => {
  if (!isLoggedIn.value) {
    await navigateTo('/login');
    return;
  }
  const liked = p.likedByMe;
  p.likedByMe = !liked;
  p.likeCount += liked ? -1 : 1;
  try {
    await $apiFetch(`/posts/${p.id}/like`, {
      method: liked ? 'DELETE' : 'POST',
    });
  } catch {
    p.likedByMe = liked;
    p.likeCount += liked ? 1 : -1;
  }
};

onMounted(load);
</script>
