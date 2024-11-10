<template>
  <UiFlex type="col" justify="center" class="pt-16">
    <UiFlex type="col" justify="center" class="mb-6">
      <UiText weight="bold" align="center" class="text-3xl md:text-4xl mb-2">Vòng Quay May Mắn</UiText>
      <UiText color="gray" class="text-sm md:text-base mb-4" align="center">
        Nhận <b class="text-primary">1</b> lượt quay với mỗi <b class="text-primary">{{ useMoney().toMoney(configStore.config.wheel.payto) }}</b> tiền nạp
      </UiText>
      <div class="ribbon" v-if="!!authStore.isLogin">
        <b class="font-bold">{{ authStore.profile.currency.wheel }}</b> lượt
      </div>
    </UiFlex>

    <UiFlex class="Circle rounded-full" justify="center" :style="{
      '--wheel-circle-deg': deg.now+'deg',
    }">
      <canvas id="Canvas" width="380" height="380"></canvas>
      <UiFlex justify="center" class="Circle__Start bg-gray-900" @click="start">
        <UiIcon name="i-bxs-color" class="beat-anim" size="10" v-if="!loading.spin"></UiIcon>
        <UiIcon name="i-bxs-color" class="animate-spin" size="10" v-else></UiIcon>
      </UiFlex>
    </UiFlex>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[250px] max-w-[250px]'}">
      <UiFlex type="col" class="py-12 px-4 cursor-pointer" justify="center" v-if="gift" @click="modal = false">
        <UiIcon :name="gift.type != 0 ? 'i-bxs-party' : 'i-bxs-sad'" class="jump-anim mb-6" size="16"></UiIcon>
        <UiText align="center" v-if="gift.type != 0">Chúc mừng bạn nhận được <b class="text-primary font-bold">x{{ gift.amount }} [{{ gift.name }}]</b></UiText>
        <UiText align="center" weight="semibold" v-else>Chúc bạn may mắn lần sau</UiText>
      </UiFlex>
    </UModal>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()

const gift = ref(undefined)
const prizes = ref(['?', '?', '?', '?', '?', '?', '?', '?'])

const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF9933", "#33FFF0",
  "#F033FF", "#33FF99", "#FF5733", "#9933FF", "#33A1FF", "#FF3377"
]

const modal = ref(false)
const loading = ref({
  list: true,
  spin: false
})

const deg = ref({
  now: 0,
  end: 0
})
const canvasPos = ref({
  el: undefined,
  ctx: undefined,
  radius: 190,
  centerX: 0,
  centerY: 0,
})
const sliceAngle = computed(() => {
  return (2 * Math.PI) / prizes.value.length
})

const initCanvas = () => {
  canvasPos.value.el = document.getElementById('Canvas')
  canvasPos.value.ctx = canvasPos.value.el.getContext('2d')
  canvasPos.value.centerX = canvasPos.value.el.width / 2;
  canvasPos.value.centerY = canvasPos.value.el.height / 2;
  canvasPos.value.el.addEventListener('transitionend', stop)
  drawWheel()
}

const drawWheel = () => {
  for (let i = 0; i < prizes.value.length; i++) {
    canvasPos.value.ctx.beginPath();
    canvasPos.value.ctx.moveTo(canvasPos.value.centerX, canvasPos.value.centerY);
    canvasPos.value.ctx.arc(canvasPos.value.centerX, canvasPos.value.centerY, canvasPos.value.radius, sliceAngle.value * i + 0, sliceAngle.value * (i + 1) + 0);
    canvasPos.value.ctx.fillStyle = colors[i % colors.length];
    canvasPos.value.ctx.fill();
    canvasPos.value.ctx.stroke();

    canvasPos.value.ctx.save();
    canvasPos.value.ctx.translate(canvasPos.value.centerX, canvasPos.value.centerY);
    canvasPos.value.ctx.rotate(sliceAngle.value * i + sliceAngle.value / 2 + 0);
    canvasPos.value.ctx.textAlign = "right";
    canvasPos.value.ctx.fillStyle = "#333";
    canvasPos.value.ctx.font = "16px Arial";
    canvasPos.value.ctx.fillText(prizes.value[i]['name'], canvasPos.value.radius - 50, 5);
    canvasPos.value.ctx.restore();
  }
}

const animation = () => {
  if(deg.value.now > deg.value.end){
    deg.value.now += Math.floor(Math.PI * 18) * -1
    window.requestAnimationFrame(animation)
  }
  else {
    deg.value.now = deg.value.end
    window.cancelAnimationFrame(animation)
  }
}
const stop = async () => {
  await authStore.setAuth()
  loading.value.spin = false

  modal.value = true
}

const start = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập để bắt đầu quay')
    if(!!loading.value.spin) return 

    getList()
    loading.value.spin = true

    const data = await useAPI('wheel/public/spin')
    gift.value = data
    const index = prizes.value.findLastIndex(i => i._id == gift.value._id)
    const aDeg = 360 / prizes.value.length
    const min = Math.ceil((aDeg * index) + 5)
    const max = Math.floor((aDeg * index) + aDeg - 5)
    const rand = Math.floor(Math.random() * (max - min + 1) + min) * -1
    deg.value.end = rand + (Math.floor(deg.value.now / 360) - 20) * 360

    window.requestAnimationFrame(animation)
  }
  catch(e){
    loading.value.spin = false
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('wheel/public/list')
    prizes.value = data

    initCanvas()
  }
  catch(e){
    loading.value.list = false
  }
}

onMounted(() => setTimeout(() => (initCanvas(), getList()), 1))
</script>

<style lang="sass">
.Circle
  display: inline-flex
  position: relative
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.5), inset 0 0 20px 3px rgb(0 0 0 / 97%)
  #Canvas
    position: relative
    border: 5px solid #333
    border-radius: 50%
    transform: rotate(var(--wheel-circle-deg))
    transition: transform 2s ease
    z-index: -1
  &__Start
    position: absolute
    width: 70px
    height: 70px
    border-radius: 50%
    border: 5px solid #fff
    cursor: pointer
    user-select: none
    &::after
      content: ''
      position: absolute
      right: -50%
      width: 60%
      height: 60%
      background: inherit
      clip-path: polygon(100% 50%, 0 20%, 0 80%)
      z-index: 0

.ribbon
  font-size: 12px
  color: #fff
  --s :1.8em
  --d:.5em
  --c:.8em
  padding: 0 calc(var(--s) + var(--d) + .5em) var(--d)
  line-height: 1.8
  background: linear-gradient(90deg, #0004 var(--d), #0000 0 calc(100% - var(--d)), #0004 0) (50% / calc(100% - 2*var(--s))) 100% no-repeat
  clip-path: polygon(0 100%, var(--s) 100%, calc(var(--s) + var(--d)) calc(100% - var(--d)), calc(100% - var(--s) - var(--d)) calc(100% - var(--d)), calc(100% - var(--s)) 100%, 100% 100%, calc(100% - var(--c)) calc(50% + var(--d)/2), 100% var(--d), calc(100% - var(--s)) var(--d), calc(100% - var(--s) - var(--d)) 0, calc(var(--s) + var(--d)) 0, var(--s) var(--d), 0 var(--d), var(--c) calc(50% + var(--d)/2))
  background-color: rgb(var(--color-primary-500))
  width: fit-content
</style>