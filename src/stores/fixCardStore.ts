import { defineStore } from 'pinia'

export const useFixCardStore = defineStore('fixCard', {
  state: () => ({
    showFixCard: false
  }),
  actions: {
    toggleFixCard() {
      this.showFixCard = !this.showFixCard
    }
  }
})