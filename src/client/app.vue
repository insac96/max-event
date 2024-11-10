<template>
  <NuxtLayout class="relative">
    <NuxtLoadingIndicator :height="2" />
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup>
useSeoMeta({
  title: () => 'Max Gamming',
  ogTitle: () => 'Max Gamming',
})
</script>