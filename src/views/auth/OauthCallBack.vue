<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
// import { userTokenStore } from '@/stores/userTokenStore';

const route = useRoute();
const router = useRouter();
//Token##########################################
import {userTokenStore} from "@/stores/token";
const tokenStore = userTokenStore();
//UserInfo###########
import { useProfileStore } from "@/stores/profileStore";
// const profileStore = useProfileStore();

onMounted(async () => {
  const token = route.query.token as string;
  if (token) {
    tokenStore.setToken(token);
    try {
      console.log(token);
      const profileRes = await axios.get("/sdApi/account/userInfo", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (profileRes.data.code === 20041) {
        const profileStore = useProfileStore();
        console.log("用户信息：", profileRes.data.data);
        profileStore.setProfileFromVO(profileRes.data.data);
      } else {
        console.error("获取用户信息失败：", profileRes.data.message);
      }
    } catch (error) {
      console.error("请求用户信息异常：", error);
    }

    router.replace('/');
  } else {
    console.error("没有拿到 token");
    router.replace('/auth/signin');
  }
});
</script>

<template>
  <div>登录中，请稍候...</div>
</template>
