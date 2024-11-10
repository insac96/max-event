<template>
  <UiContent 
    title="Config" 
    sub="Chỉnh sửa cấu hình trang" 
    class="max-w-2xl mx-auto"
  >
    <UForm :state="state">
      <UFormGroup label="Tỷ lệ quy đổi tiền nạp ra vòng quay">
        <UInput v-model="state.wheel.payto" type="number" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-4">
        <UButton @click="update" :loading="updating">Cập nhật</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  wheel: {
    payto: 0,
  }
})

const getConfig = async () => {
  const config = await useAPI('config/public/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true
    await useAPI('config/manage/update', JSON.parse(JSON.stringify(state.value)))

    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>