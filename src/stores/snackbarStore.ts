import { defineStore } from "pinia";

type MessageType = "" | "info" | "success" | "error" | "warning";

export const useSnackbarStore = defineStore({
  id: "snackbarStore",
  state: () => ({
    isShow: false,
    message: "",
    type: "",
  }),

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: [""] }],
  },

  getters: {},
  actions: {
    // 修正：参数改为 string 类型，表示消息内容
    showMessage(message: string, type: MessageType = "") {
      this.isShow = true;
      this.message = message;
      this.type = type;
    },

    // 其他方法保持逻辑不变，但参数类型改为 string
    showErrorMessage(message: string) {
      this.showMessage(message, "error");
    },
    showSuccessMessage(message: string) {
      this.showMessage(message, "success");
    },
    showInfoMessage(message: string) {
      this.showMessage(message, "info");
    },
    showWarningMessage(message: string) {
      this.showMessage(message, "warning");
    },
  },
});
