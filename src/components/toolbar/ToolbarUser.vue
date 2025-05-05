<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
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
const profileStore = useProfileStore();
const account = reactive({ ...profileStore.account });
const signon = reactive({ ...profileStore.signon });
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
  // 跳转到首页
  router.push("/");  // 可以根据需要修改首页路径
  // 刷新页面
  window.location.reload();  // 刷新页面
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
              :src="signon.avatarUrl"
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
        <v-list-item to="/profile">
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img
                :src="signon.avatarUrl"
              ></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            {{signon.username}}
            <StatusMenu />
          </v-list-item-title>
          <v-list-item-subtitle>
            <!-- {{ $store.state.user.email  }} -->
            {{account.email}}
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
