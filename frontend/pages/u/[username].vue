<template>
  <div>
    <div v-if="pending" class="py-10 text-center text-gray-400">در حال بارگذاری…</div>

    <div v-else-if="profile">
      <div class="card mb-6 p-6">
        <div class="flex items-center gap-4">
          <img
            :src="profile.avatarUrl || fallbackAvatar(profile.username)"
            class="h-20 w-20 rounded-full object-cover"
            alt="avatar"
          >
          <div class="flex-1">
            <h1 class="text-xl font-bold">{{ profile.displayName || profile.username }}</h1>
            <p class="text-sm text-gray-500">@{{ profile.username }}</p>
          </div>
          <button
            v-if="!profile.isMe && isLoggedIn"
            class="px-4 py-2 text-sm"
            :class="profile.isFollowing ? 'btn-ghost' : 'btn-primary'"
            @click="toggleFollow"
          >
            {{ profile.isFollowing ? 'دنبال‌شده' : 'دنبال‌کردن' }}
          </button>
        </div>

        <p v-if="profile.bio" class="mt-3 text-sm">{{ profile.bio }}</p>

        <div class="mt-4 flex gap-6 text-sm">
          <span><b>{{ profile.postCount }}</b> پست</span>
          <span><b>{{ profile.followerCount }}</b> دنبال‌کننده</span>
          <span><b>{{ profile.followingCount }}</b> دنبال‌شده</span>
        </div>
      </div>

      <div v-if="posts.length === 0" class="card p-10 text-center text-gray-500">
        هنوز پستی نیست.
      </div>

      <div class="grid grid-cols-3 gap-1">
        <NuxtLink
          v-for="p in posts"
          :key="p.id"
          :to="`/post/${p.id}`"
          class="relative aspect-square overflow-hidden bg-black"
        >
          <video
            v-if="p.mediaType === 'VIDEO'"
            :src="p.mediaUrl"
            class="h-full w-full object-cover"
            muted
          />
          <img
            v-else
            :src="p.mediaUrl"
            class="h-full w-full object-cover"
            alt="post"
          >
          <span
            v-if="p.mediaType === 'VIDEO'"
            class="absolute right-1 top-1 text-xs text-white drop-shadow"
          >▶</span>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="card p-10 text-center text-gray-500">کاربر پیدا نشد.</div>
  </div>
</template>

<script setup lang="ts">
import type { Post, Profile } from '~/types';

const route = useRoute();
const { isLoggedIn } = useAuth();
const username = computed(() => route.params.username as string);

const profile = ref<Profile | null>(null);
const posts = ref<Post[]>([]);
const pending = ref(true);

const fallbackAvatar = (u: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${u}`;

const load = async () => {
  pending.value = true;
  try {
    const [pr, ps] = await Promise.all([
      $apiFetch<Profile>(`/users/${username.value}`),
      $apiFetch<Post[]>(`/users/${username.value}/posts`),
    ]);
    profile.value = pr;
    posts.value = ps;
  } catch {
    profile.value = null;
  } finally {
    pending.value = false;
  }
};

const toggleFollow = async () => {
  if (!profile.value) return;
  const wasFollowing = profile.value.isFollowing;
  profile.value.isFollowing = !wasFollowing;
  profile.value.followerCount += wasFollowing ? -1 : 1;
  try {
    await $apiFetch(`/users/${username.value}/follow`, {
      method: wasFollowing ? 'DELETE' : 'POST',
    });
  } catch {
    profile.value.isFollowing = wasFollowing;
    profile.value.followerCount += wasFollowing ? 1 : -1;
  }
};

watch(username, load);
onMounted(load);
</script>
