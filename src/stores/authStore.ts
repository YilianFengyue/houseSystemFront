import { defineStore } from "pinia";
import axios from "axios";

import router from "@/router";

//snackBar
import { useSnackbarStore } from "@/stores/snackbarStore";

//存储token
import {userTokenStore} from "@/stores/token";
import { useProfileStore } from "@/stores/profileStore";
// const tokenStore = userTokenStore();

interface Profile {
  id: string;
  name: string;
  avatar: string;
  created: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null,
    profile: null as Profile | null,
  }),

  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ["isLoggedIn"] },
      // { storage: sessionStorage, paths: ["profile"] }
    ],
  },

  getters: {},

  actions: {
    setLoggedIn(payload: boolean) {
      this.isLoggedIn = payload;
    },
    //注册方法

    async registerWithUsernameAndPassword(username: string, password: string) {
      try {

        const response = await axios.post(
          //跨域仍存在问题
          "/sdApi/account/register",
          new URLSearchParams({
            username,
            password,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        if (response.data.code === 20011) {
          // 注册成功后，直接跳转到登录页面

          router.push("/auth/signin");
        } else {
          console.error("注册失败：", response.data.message);
        }
      } catch (error: any) {
        console.error("请求异常：", error?.response?.data?.message || error.message);
      }
    },
    registerWithEmailAndPassword(email: string, password: string) {
      router.push("/");
    },
    //登录方法
    async loginWithUsernameAndPassword(username: string, password: string) {
      try {
        const response = await axios.post(
          "/sdApi/account/login",
          new URLSearchParams({
            username,
            password,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (response.data.code === 20011) {
          this.setLoggedIn(true);
          this.user = response.data.data;
          //存储token到pinia
          // console.log( response.data.msg);
          const tokenStore = userTokenStore();
          tokenStore.setToken(response.data.msg);
          console.log("tokenStore", tokenStore.token);
          //存储用户信息到profilestore
                // 2. 设置 token 到全局 axios headers
            // axios.defaults.headers.common["Authorization"] = response.data.token;
            console.log("完整登录响应数据：", response.data);
            console.log("拼接出的 Authorization:", `Bearer ${response.data.msg}`);
            // 3. 获取用户信息 /userInfo（你后端写好的合并接口）
            // const profileRes = await axios.get("http://localhost:81/account/userInfo");
            // const profileRes = await axios.get("http://localhost:81/account/userInfo", {
            //   headers: {
            //     Authorization: `${response.data.token}`,
            //   },
            // });
            const profileRes = await axios.get("/sdApi/account/userInfo", {
              headers: {
                Authorization: `${response.data.msg}`,
              },
            });
            if (profileRes.data.code === 20041) {
              const ProfileStore = useProfileStore();
              console.log(profileRes.data.data)
              ProfileStore.setProfileFromVO(profileRes.data.data)
            } else {
              console.error("获取用户信息失败：", profileRes.data.message);
            }
          router.push("/");
        } else {
          const snackbarStore = useSnackbarStore();
          snackbarStore.showErrorMessage("密码错误！");
          console.error("登录失败：", response.data.message);
        }
      } catch (error: any) {
        console.error("请求异常：", error?.response?.data?.message || error.message);
      }
    },
    loginWithEmailAndPassword(email: string, password: string) {
      router.push("/");
    },

    loginWithGoogle() {
      router.push("/");
    },
    async loginWithGithub() {
      // try {
      //   const response = await axios.post(
      //     "http://localhost:81/oauth/render",
      //   );
      //   if (response.data.code === 20011) {
      //     this.setLoggedIn(true);
      //     this.user = response.data.data;
      //     router.push("/");
      //   } else {
      //     console.error("登录失败：", response.data.message);
      //   }
      // } catch (error: any) {
      //   console.error("请求异常：", error?.response?.data?.message || error.message);
      // }
      window.location.href = "/sdApi/oauth/render";
      // router.push("/");
    },

    logout() {
      router.push({ name: "auth-signin" });
    },
  },
});
