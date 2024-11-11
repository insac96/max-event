<template>
  <div>
    <LoadingTable v-if="loading" />

    <UTable :columns="columns" :rows="list" class="BoxBlock rounded-xl">
      <template #user-data="{ row }">
        {{ row.user.username }}
      </template>

      <template #createdAt-data="{ row }">
        {{ useDayJs().displayFull(row.createdAt) }}
      </template>
    </UTable>
  </div>
</template>

<script setup>
const emits = defineEmits(['close'])
const loading = ref(false)

const list = ref([])

const columns = [
  {
    key: 'name',
    label: 'Phần thưởng',
  },{
    key: 'amount',
    label: 'Tổng giải',
  }
]

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('wheel/public/list')
    
    list.value = data
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>