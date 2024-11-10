<template>
  <div>
    <UiFlex>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1" />
    </UiFlex>

    <LoadingTable v-if="loading" />

    <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
      <template #createdAt-data="{ row }">
        {{ useDayJs().displayFull(row.createdAt) }}
      </template>

      <template #received-data="{ row }">
        <UBadge size="xs" color="green" variant="soft" v-if="!!row.received">Đã trao</UBadge>
        <UBadge size="xs" color="gray" variant="soft" v-if="!row.received">Chưa trao</UBadge>
      </template>
    </UTable>

    <UiFlex justify="end" class="mt-4">
      <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
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
    label: 'Số lượng',
  },{
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
  },{
    key: 'received',
    label: 'Trạng thái',
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('wheel/public/history', JSON.parse(JSON.stringify(page.value)))
    
    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>