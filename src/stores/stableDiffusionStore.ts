import { defineStore } from "pinia";



export const useStableDiffusionStore = defineStore({
  id: "stableDiffusion",
  state: () => ({
    imgList: [],
    imgUrl: "",
    modelList: [],
    currentModel: "",
  }),

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: [""] }],
  },

  getters: {},
  actions: {
    updateImgList(imgList: []) {
      this.imgList = imgList;
    },
    // 更新单个 imgUrl
    updateImgUrl(imgUrl: string) {
      this.imgUrl = imgUrl;
    },
    updateModelList(modelList: []) {
      this.modelList = modelList;
    },
  },
});
