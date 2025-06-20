<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<!-- <script setup lang="ts">
import {onMounted} from "vue";
//Token##########################################
import {userTokenStore} from "@/stores/token";
const tokenStore = userTokenStore();
const isLoggedIn =tokenStore.isLoggedIn;

//##############################################

import StatusMenu from "./StatusMenu.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
const router = useRouter();

//用户相关信息#################################
import { useProfileStore } from "@/stores/profileStore";
import axios from "axios";
const profileStore = useProfileStore();
const account = reactive({ ...profileStore.user });

//#############################################

const authStore = useAuthStore();
// const handleLogout = () => {
//   authStore.logout();
//   console.log("---");
//   console.log(router);
// };
const handleLogout = () => {
  // 清除 token
  tokenStore.removeToken();
  // 跳转到首页 dashboard
  window.location.href = "/dashboard";  // 这样会触发完整页面加载
};
const goToSignIn = () => {
  router.push("/auth/signin");  // 跳转到登录页
};
const navs = [
  {
    title: "UserInfo",
    link: "/profile",
    icon: "mdi-account-box-outline",
  },
];
onMounted(() => {

  console.log("isLoggedIn", isLoggedIn);
});


//---------------------------------
//用户头像
//---------------------------------
// 用户相关信息

// 添加头像相关状态
const avatarRefreshKey = ref(0); // 用于强制刷新图片缓存
const avatarUrl = ref(""); // 存储头像URL

// 定义默认头像URL
const DEFAULT_AVATAR = "http://localhost:5000/user/images/16_20250612121326.jpg";

// 获取用户头像
const loadUserAvatar = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/user/userinfo/avatar`,
      { 
        params: { id: profileStore.getUserId() },
        headers: {
          Authorization: `Bearer ${tokenStore.token}` // 添加认证头
        }
      }
    );
    
    if (response.data.code === 200) {
      avatarUrl.value = response.data.data.avatarUrl;
      avatarRefreshKey.value++; // 更新key强制重新加载图片
    } else {
      console.error('获取头像失败:', response.data.message);
      avatarUrl.value = "/default-avatar.png"; // 使用默认头像
    }
  } catch (error) {
    console.error('加载头像失败:', error);
    avatarUrl.value = DEFAULT_AVATAR; // 使用新的默认头像
  }
};

// 在组件挂载时加载头像
onMounted(() => {
  console.log("isLoggedIn", isLoggedIn);
  if (isLoggedIn) {
    loadUserAvatar();
  }
});
</script> -->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";
import { userTokenStore } from "@/stores/token"; // 假设你的文件名是 tokenStore
import { useProfileStore } from "@/stores/profileStore";
import StatusMenu from "./StatusMenu.vue";

// --- 1. 获取 Store 实例 ---
const router = useRouter();
const tokenStore = userTokenStore();
const profileStore = useProfileStore();

// --- 2. 使用 storeToRefs 创建响应式引用 ---
// 这样 isLoggedIn 和 user 就会始终与 store 保持同步
const { isLoggedIn } = storeToRefs(tokenStore);
const { user } = storeToRefs(profileStore);

// --- 3. 保留需要的函数 ---
const handleLogout = () => {
  tokenStore.removeToken();
  // 推荐使用 router.push，除非你确实需要硬刷新
  router.push("/auth/signin"); 
};

const goToSignIn = () => {
  router.push("/auth/signin");
};

const navs = [
  {
    title: "个人中心", // 优化一下文案
    link: "/profile",
    icon: "mdi-account-box-outline",
  },
];

// 之前那个复杂的 loadUserAvatar 函数和相关的 onMounted 都可以彻底删除了！
</script>
<template>
   <!-- 未登录时显示登录按钮 -->
   <v-menu
    v-if="!isLoggedIn"
    :close-on-content-click="false"
    location="bottom right"
    transition="slide-y-transition"
    >
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="2" color="success" dot bordered>
          <v-avatar size="40">
            <v-img
              src="./images/unavater.png"  
            ></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- ---------------------------------------------- -->
        <!-- Profile Area -->
        <!-- ---------------------------------------------- -->
        <v-list-item >
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img
                src="./images/unavater.png"
              ></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            User
            <StatusMenu />
          </v-list-item-title>
          <v-list-item-subtitle>
            <!-- {{ $store.state.user.email  }} -->
            You are not logged in
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Menu Area -->
      <!-- ---------------------------------------------- -->

      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item
          color="primary"
          @click="goToSignIn" 
          link
          density="compact"
        >
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-login</v-icon> 
            </v-avatar>
          </template>
          <div>
            <v-list-item-subtitle class="text-body-2">
              SignIN
            </v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
      <v-divider />
    </v-card>
  </v-menu>

  <v-menu
    v-else
    :close-on-content-click="false"
    location="bottom right"
    transition="slide-y-transition"
  >
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="2" color="success" dot bordered>
          <v-avatar size="40">
            <v-img
              :src="user.avatarUrl || './images/unavater.png'"
              
            ></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- Profile Area -->
        <v-list-item to="/profile">
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img
                :src="user.avatarUrl || './images/unavater.png'"
                
              ></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            {{user.name}}
            <StatusMenu />
          </v-list-item-title>
          <v-list-item-subtitle>
            {{user.email}}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Menu Area -->
      <!-- ---------------------------------------------- -->

      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item
          color="primary"
          v-for="(nav, i) in navs"
          :key="i"
          :to="nav.link"
          link
          density="compact"
        >
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>{{ nav.icon }}</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">{{
              nav.title
            }}</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Logout Area -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item color="primary" to="nav.link" link density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-lifebuoy</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">
              HelpCenter
            </v-list-item-subtitle>
          </div>
        </v-list-item>
        <v-list-item
          color="primary"
          link
          @click="handleLogout"
          density="compact"
        >
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-logout</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">
              SignOut
            </v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped lang="scss"></style>
