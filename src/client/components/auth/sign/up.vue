<template>
  <UiContent title="Đăng Ký" sub="Vui lòng sử dụng số điện thoại đăng ký tại Max Gamming" no-dot>
    <UForm
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup label="Số điện thoại" name="phone">
        <UInput icon="i-bxs-phone" v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu" :hint="`${state.password ? state.password.length : 0}/15`" name="password">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UiFlex justify="between" class="mt-4">
        <UiText pointer size="sm" color="gray" @click="emit('in')">Đăng nhập ngay ?</UiText>
        <UButton type="submit" :loading="loading">Đăng Ký</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const emit = defineEmits(['done', 'in'])

const loading = ref(false)

const state = ref({
  phone: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: 'Định dạng không đúng' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })
  return errors
}


const submit = async () => {
  try {
    loading.value = true

    await useAPI('auth/public/sign/up', JSON.parse(JSON.stringify(state.value)))
    await authStore.setAuth()

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>