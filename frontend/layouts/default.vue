<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-xl font-bold text-brand">Vibe</NuxtLink>
        <nav class="flex items-center gap-2">
          <NuxtLink to="/" class="btn-ghost px-3 py-1.5 text-sm">فید</NuxtLink>
          <template v-if="isLoggedIn">
            <NuxtLink to="/upload" class="btn-primary px-3 py-1.5 text-sm">+ پست</NuxtLink>
            <NuxtLink
              :to="`/u/${user?.username}`"
              class="flex items-center gap-2"
            >
              <img
                :src="user?.avatarUrl || fallbackAvatar(user?.username)"
                class="h-8 w-8 rounded-full object-cover"
                alt="avatar"
              >
            </NuxtLink>
            <button class="btn-ghost px-3 py-1.5 text-sm" @click="logout">خروج</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-primary px-3 py-1.5 text-sm">ورود</NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-2xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, user, clearSession } = useAuth();

const logout = async () => {
  clearSession();
  await navigateTo('/login');
};

const fallbackAvatar = (username?: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${username || 'user'}`;
</script>
