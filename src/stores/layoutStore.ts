import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLayoutStore = defineStore('layout', () => {
  
  const isSidebarOpen = ref(true); // 初始状态，可以根据需要调整，例如根据屏幕宽度

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  function setSidebarOpen(value: boolean) {
    isSidebarOpen.value = value;
  }

  return { isSidebarOpen, toggleSidebar, setSidebarOpen };
});