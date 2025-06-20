<script setup lang="ts">
import MainSidebar from "@/components/navigation/MainSidebar.vue";
import MainAppbar from "@/components/toolbar/MainAppbar.vue";
// import GlobalLoading from "@/components/GlobalLoading.vue";
import ToolBox from "@/components/Toolbox.vue";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
const customizeTheme = useCustomizeThemeStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Main Sidebar -->
  <!-- ---------------------------------------------- -->
  <MainSidebar />
  <!-- ---------------------------------------------- -->
  <!---Top AppBar -->
  <!-- ---------------------------------------------- -->
  <MainAppbar />
  <!-- ---------------------------------------------- -->
  <!---MainArea -->
  <!-- ---------------------------------------------- -->

  <v-main
    class="main-container"
    v-touch="{
      left: () => (customizeTheme.mainSidebar = false),
      right: () => (customizeTheme.mainSidebar = true),
    }"
  >
    <!-- <GlobalLoading /> -->
    <ToolBox />
    <div class="flex-fill">
      <slot></slot>
    </div>
  </v-main>
</template>

<style scoped>
.scrollnav {
  height: calc(100vh - 326px);
}
.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 80%;
  /* 使用 margin: auto 来使其在 v-main 内居中 */
  margin-left: auto !important;  
  margin-right: auto !important;
  
}

@media (max-width: 959px) {
  .main-container {
    width: 100%; 
    margin-left: 0 !important; 
    margin-right: 0 !important;
   
  }
}
</style>
