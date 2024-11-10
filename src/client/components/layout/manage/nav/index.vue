<template>
  <UAccordion 
    :items="navItems" 
    :ui="{
      'item': { padding: 'pt-0 pb-2 pl-6' },
    }"
    multiple
  >
    <template #default="{item, open}">
      <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
        <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'"/>
        <UiText 
          class="mx-4" 
          size="sm" 
          weight="semibold" 
          :color="open ? 'primary' : 'gray'"
          :text="item.label"
        />
        <UiIcon
          name="i-bx-chevron-right"
          size="5"
          :color="open ? 'primary' : 'gray'"
          class="ms-auto transform transition-transform duration-200"
          :class="[open && 'rotate-90']"
        />
      </UiFlex>
    </template>
    <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
    <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
    <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
  </UAccordion>
</template>

<script setup>
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: true,
    slot: 'tab-0',
    children: [
      { label: 'Tài khoản', to: '/manage/user' },
      { label: 'Cài đặt', to: '/manage/config' },
    ]
  },
  {
    label: 'Nhật ký',
    icon: 'i-bxs-book',
    defaultOpen: true,
    slot: 'tab-1',
    children: [
      { label: 'Biến động Xu', to: '/manage/log/coin' },
      { label: 'Biến động Lượt quay', to: '/manage/log/wheel' }
    ]
  },
  {
    label: 'Vòng quay',
    icon: 'i-bx-color',
    defaultOpen: true,
    slot: 'tab-2',
    children: [
      { label: 'Danh sách', to: '/manage/wheel' },
      { label: 'Lịch sử', to: '/manage/wheel/history' },
    ]
  }
]
</script>