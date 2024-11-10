import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types'

export const useConfigStore = defineStore('config', () => {
  const config : IDBConfigStore = reactive({
    wheel: {
      payto: 0,
    }
  })

  const bootConfig = async () => {
    const cfg : IDBConfigStore = await useAPI('config/public/get')
    Object.assign(config, cfg)
  }

  return { config, bootConfig }
})