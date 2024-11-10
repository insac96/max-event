<template>
  <UContainer class="
    LayoutPublicHeader 
    sticky top-0 z-50 
    bg-white/75 dark:bg-gray-900
    backdrop-blur-xl 
    flex items-center gap-1
    h-[var(--header-size)] max-h-[var(--header-size)]
  ">
    <UiFlex>
      <NuxtLink to="/">
        <UiLogo />
      </NuxtLink>
    </UiFlex>

    <UiFlex justify="end" items="center" class="ml-auto gap-1">
      <LazyAuthSign v-if="!authStore.isLogin" />
      <LazyAuthHeader v-else />
    </UiFlex>
  </UContainer>
</template>

<script setup>
const authStore = useAuthStore()
</script>