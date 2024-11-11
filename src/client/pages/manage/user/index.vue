<template>
  <UiContent title="User" sub="Quản lý tài khoản người dùng">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'PHONE', 'MAIL']" />
        </UiFlex>
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
        <template #username-data="{ row }">
          {{ row.username }}
        </template>

        <template #email-data="{ row }">
          {{ row.email || '...' }}
        </template>

        <template #phone-data="{ row }">
          {{ row.phone || '...' }}
        </template>

        <template #coin-data="{ row }">
          {{ useMoney().toMoney(row.coin || 0) }}
        </template>

        <template #wheel-data="{ row }">
          {{ useMoney().toMoney(row.wheel || 0) }}
        </template>

        <template #type-data="{ row }">
          <UBadge :color="typeFormat[row.type].color" variant="soft">
            {{ typeFormat[row.type].label }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Edit Auth-->
    <UModal v-model="modal.editAuth" preventClose>
      <UForm :state="stateEditAuth" @submit="editAuthAction" class="p-4">
        <UFormGroup label="Email">
          <UInput v-model="stateEditAuth.email" />
        </UFormGroup>

        <UFormGroup label="Số điện thoại">
          <UInput v-model="stateEditAuth.phone" />
        </UFormGroup>

        <UFormGroup label="Mật khẩu">
          <UInput v-model="stateEditAuth.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Quyền">
          <SelectAuthType v-model="stateEditAuth.type" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.editAuth">Sửa</UButton>
          <UButton color="gray" @click="modal.editAuth = false" :disabled="loading.editAuth" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Currency-->
    <UModal v-model="modal.editCurrency" preventClose>
      <UForm :state="stateEditCurrency" @submit="editCurrencyAction" class="p-4">
        <UFormGroup label="Xu">
          <UInput v-model="stateEditCurrency.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Lượt quay">
          <UInput v-model="stateEditCurrency.wheel" type="number" />
        </UFormGroup>

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditCurrency.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.editCurrency">Thêm</UButton>
          <UButton color="gray" @click="modal.editCurrency = false" :disabled="loading.editCurrency" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Add Payment-->
    <UModal v-model="modal.addPayment" preventClose>
      <UForm :state="stateAddPayment" @submit="addPaymentAction" class="p-4">
        <UFormGroup label="Số tiền nạp">
          <UInput v-model="stateAddPayment.money" type="number" />
        </UFormGroup>

        <UFormGroup label="Lượt quay nhận">
          <UInput :model-value="wheelPayment" type="number" disabled />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.addPayment">Xác nhận</UButton>
          <UButton color="gray" @click="modal.addPayment = false" :disabled="loading.addPayment" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const { config } = useConfigStore()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'username',
    label: 'Tên',
  },{
    key: 'email',
    label: 'Email',
  },{
    key: 'phone',
    label: 'SĐT',
  },{
    key: 'coin',
    label: 'Xu',
    sortable: true
  },{
    key: 'wheel',
    label: 'Lượt quay',
    sortable: true
  },{
    key: 'type',
    label: 'Quyền',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  },{
    key: 'actions',
    label: 'Chức năng',
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
    key: null,
    by: 'PHONE'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateEditAuth = ref({
  _id: null,
  email: null,
  phone: null,
  password: null,
  type: null,
})

const stateEditCurrency = ref({
  _id: null,
  coin: 0,
  wheel: 0
})

const stateAddPayment = ref({
  _id: null,
  money: null
})

const wheelPayment = computed(() => {
  if(!stateAddPayment.value.money) return 0
  return Math.floor(stateAddPayment.value.money / config.wheel.payto)
})

// Modal
const modal = ref({
  user: false,
  editAuth: false,
  editCurrency: false,
  addPayment: false
})

watch(() => modal.value.addPayment, (val) => !val && (stateAddPayment.value = {
  _id: null,
  money: null
}))

watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
  _id: null,
  coin: 0,
  wheel: 0
}))

// Loading
const loading = ref({
  load: true,
  editAuth: false,
  editCurrency: false,
  addPayment: false
})

// Type
const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'S-MOD', color: 'green' },
  100: { label: 'ADMIN', color: 'red' },
}

// Actions
const actions = (row) => [
  [{
    label: 'Nạp tiền',
    icon: 'i-bx-credit-card',
    click: () => {
      stateAddPayment.value._id = row._id
      modal.value.addPayment = true
    }
  }],
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
      modal.value.editAuth = true
    }
  },{
    label: 'Thêm tiền tệ',
    icon: 'i-bx-coin-stack',
    click: () => {
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'plus'
      modal.value.editCurrency = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editAuthAction = async () => {
  try {
    loading.value.editAuth = true
    await useAPI('user/manage/edit/profile', JSON.parse(JSON.stringify(stateEditAuth.value)))

    loading.value.editAuth = false
    modal.value.editAuth = false
    getList()
  }
  catch (e) {
    loading.value.editAuth = false
  }
}

const editCurrencyAction = async () => {
  try {
    loading.value.editCurrency = true
    await useAPI('user/manage/edit/currency', JSON.parse(JSON.stringify(stateEditCurrency.value)))

    loading.value.editCurrency = false
    modal.value.editCurrency = false
    getList()
  }
  catch (e) {
    loading.value.editCurrency = false
  }
}

const addPaymentAction = async () => {
  try {
    loading.value.addPayment = true
    await useAPI('user/manage/add/payment', JSON.parse(JSON.stringify(stateAddPayment.value)))

    loading.value.addPayment = false
    modal.value.addPayment = false
    getList()
  }
  catch (e) {
    loading.value.addPayment = false
  }
}

getList()
</script>
