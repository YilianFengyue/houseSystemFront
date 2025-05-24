<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
//Token

import { useDisplay } from "vuetify";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import ToolbarNotifications from "./ToolbarNotifications.vue";
import ToolbarUser from "./ToolbarUser.vue";

//search
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFixCardStore } from '@/stores/fixCardStore' // 新增：引入fixCardStore

const fixCardStore = useFixCardStore() // 新增：创建fixCardStore实例

// 新增：toggleFixCard函数，用于切换固定卡片状态
const toggleFixCard = () => {
  fixCardStore.toggleFixCard()
}

const searchQuery = ref(''); // 定义搜索查询变量
const router = useRouter(); // 使用 Vue Router

const searchProduct = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/product', query: { search: searchQuery.value } });
  }
};
const { mdAndUp } = useDisplay();
const customizeTheme = useCustomizeThemeStore();

// 新增：fix-btn相关状态（如果需要）
const variants = ['tonal']
const color = ref('indigo')

</script>

<template>
  <!-- ---------------------------------------------- -->
  <!--App Bar -->
  <!-- ---------------------------------------------- -->
  <v-app-bar :density="mdAndUp ? 'default' : 'compact'">
    <!-- ---------------------------------------------- -->
    <!-- search input mobil -->
    <!-- ---------------------------------------------- -->

    <div class="px-2 d-flex align-center justify-space-between w-100">
      <!-- ---------------------------------------------- -->
      <!-- NavIcon -->
      <!-- ---------------------------------------------- -->
      <v-app-bar-nav-icon
        @click="customizeTheme.mainSidebar = !customizeTheme.mainSidebar"
      ></v-app-bar-nav-icon>
      <div>
        <v-text-field
          v-if="mdAndUp"
          class="ml-2"
          style="width: 400px"
          color="primary"
          variant="solo"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          hide-details
          placeholder="Search"
          v-model="searchQuery"
          @keyup.enter="searchProduct"
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>

      <!-- 新增：扳手按钮 -->
      <v-btn
        class="ma-2"
        color="grey"
        icon="mdi-wrench"
        @click="toggleFixCard"
      ></v-btn>

      <ToolbarNotifications />
      <v-btn icon @click="customizeTheme.themeDrawer = !customizeTheme.themeDrawer">
        <v-icon>mdi-cart</v-icon>
      </v-btn>

      <div class="d-flex">
        <ToolbarUser />
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>