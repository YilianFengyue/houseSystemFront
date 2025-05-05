import { defineStore } from "pinia";

export const useChatGPTStore = defineStore({
  id: "chatGPT",
  state: () => ({
    propmpt: "",
    configDialog: false,
    apiKey: "sk-peE5Ux1D4w9lahUYB71c145bD2874226Ae7eF696B3De1930",
    proxyUrl: "https://api.vveai.com",
    model: "gpt-4-turbo-2024-04-09",
  }),

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ["propmpt", "apiKey", "proxyUrl", "model"] }],
  },

  getters: {
    // If you have set up an API key, please use your own key. If not, please use the one I provided.
    // getApiKey: (state) => state.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
    getApiKey: (state) => state.apiKey,
  },
  actions: {
    updatePropmpt() { },
    updateModel(model: string) {
      this.model = model;
    },
  },
});
