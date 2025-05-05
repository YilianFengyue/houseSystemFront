import { defineStore } from "pinia";
import { ref } from "vue";

export const userTokenStore = defineStore('token', () => {
  // 1. 定义描述 token
  const token = ref(localStorage.getItem('token') || '');
  const isLoggedIn = computed(() => !!token.value);
  // 2. 定义修改 token 的方法
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  // 3. 定义移除 token 的方法
  const removeToken = () => {
    token.value = '';
    localStorage.removeItem('token');
  };
  // 5. 获取 token（新增）
  const getToken = () => {
    console.log('getToken:', token.value);
    return token.value;
  };
  return {
    isLoggedIn,
    token,
    setToken,
    removeToken,
    getToken
  };
});
