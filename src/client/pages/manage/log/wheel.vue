<template>
  <UiContent title="Log Add Wheel" sub="Nhật ký thêm lượt quay">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search.from" placeholder="Tìm kiếm người gửi" icon="i-bx-search" size="sm" />
      </UForm>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search.to" placeholder="Tìm kiếm người nhận" icon="i-bx-search" size="sm" />
      </UForm>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      > 
        <template #from-data="{ row }">
          <UBadge color="gray">{{ row.from.username }}</UBadge>
        </template>

        <template #to-data="{ row }">
          <UBadge color="gray">{{ row.to.username }}</UBadge>
        </template>

        <template #add-data="{ row }">{{ toMoney(row.add) }}</template>
        <template #start-data="{ row }">{{ toMoney(row.start) }}</template>
        <template #end-data="{ row }">{{ toMoney(row.end) }}</template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'from',
    label: 'Từ',
  },{
    key: 'to',
    label: 'Đến',
  },{
    key: 'start',
    label: 'Lúc đầu'
  },{
    key: 'add',
    label: 'Thêm / Bớt',
  },{
    key: 'end',
    label: 'Sau'
  },{
    key: 'reason',
    label: 'Lý do'
  },{
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: {
    from: null,
    to: null
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.from, (val) => !val && getList())
watch(() => page.value.search.to, (val) => !val && getList())

// Loading
const loading = ref({
  load: true,
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('log/manage/wheel', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
