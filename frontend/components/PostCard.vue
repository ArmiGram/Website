<template>
  <article class="card overflow-hidden">
    <div class="flex items-center gap-3 px-4 py-3">
      <NuxtLink :to="`/u/${post.author.username}`">
        <img
          :src="post.author.avatarUrl || fallbackAvatar(post.author.username)"
          class="h-9 w-9 rounded-full object-cover"
          alt="avatar"
        >
      </NuxtLink>
      <div class="leading-tight">
        <NuxtLink :to="`/u/${post.author.username}`" class="font-semibold hover:underline">
          {{ post.author.displayName || post.author.username }}
        </NuxtLink>
        <p class="text-xs text-gray-500">@{{ post.author.username }}</p>
      </div>
      <span class="ml-auto text-xs text-gray-400">{{ timeAgo(post.createdAt) }}</span>
    </div>

    <div class="bg-black">
      <video
        v-if="post.mediaType === 'VIDEO'"
        :src="post.mediaUrl"
        class="max-h-[70vh] w-full bg-black"
        controls
        playsinline
        :poster="post.thumbnailUrl || undefined"
      />
      <img
        v-else
        :src="post.mediaUrl"
        class="max-h-[70vh] w-full object-contain"
        alt="post media"
      >
    </div>

    <div class="px-4 py-3">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-1.5 text-sm font-medium"
          :class="post.likedByMe ? 'text-brand' : 'text-gray-700'"
          @click="$emit('toggle-like', post)"
        >
          <span>{{ post.likedByMe ? '♥' : '♡' }}</span>
          <span>{{ post.likeCount }}</span>
        </button>
        <NuxtLink
          :to="`/post/${post.id}`"
          class="flex items-center gap-1.5 text-sm font-medium text-gray-700"
        >
          <span>💬</span>
          <span>{{ post.commentCount }}</span>
        </NuxtLink>
      </div>

      <p v-if="post.caption" class="mt-2 text-sm">
        <NuxtLink :to="`/u/${post.author.username}`" class="font-semibold">
          {{ post.author.username }}
        </NuxtLink>
        <span class="ml-1">{{ post.caption }}</span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Post } from '~/types';

defineProps<{ post: Post }>();
defineEmits<{ (e: 'toggle-like', post: Post): void }>();

const fallbackAvatar = (username: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الان';
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days} روز پیش`;
};
</script>
