import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RentalProperty } from '@/types/type' // 假设你有定义RentalProperty类型

export const useFixCardStore = defineStore('fixCard', () => {
  const showFixCard = ref(false)
  const fixType = ref<'repair' | 'complain'>('repair')
  const currentProperty = ref<RentalProperty | null>(null)

  const toggleFixCard = () => {
    showFixCard.value = !showFixCard.value
  }

  const setFixType = (type: 'repair' | 'complain') => {
    fixType.value = type
  }

  const setCurrentProperty = (property: RentalProperty) => {
    currentProperty.value = property
  }

  return {
    showFixCard,
    fixType,
    currentProperty,
    toggleFixCard,
    setFixType,
    setCurrentProperty
  }
})