<template>
  <UForm :state="state" @submit="submit" v-if="!!authStore.isLogin && !!profile">
    <UFormGroup name="email" label="Email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UiFlex justify="end" class="mt-4">
      <UButton type="submit" :loading="loading.edit">Xác Nhận</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const authStore = useAuthStore()
const profile = ref(undefined)

const loading = ref({
  profile: false,
  edit: false
})

const state = ref({
  email: null
})

const submit = async () => {
  try {
    loading.value.edit = true
    await useAPI('auth/public/edit/profile', JSON.parse(JSON.stringify(state.value)))

    loading.value.edit = false
  }
  catch(e){
    loading.value.edit = false
  }
}

const getUser = async () => {
  try {
    loading.value.profile = true
    const data = await useAPI('user/public/profile', {
      _id: authStore.profile._id
    })

    profile.value = data
    state.value.email = data.email
    state.value.phone = data.phone
    loading.value.profile = false
  }
  catch(e){
    loading.value.profile = true
  }
}

onMounted(() => setTimeout(getUser, 1))
</script>

