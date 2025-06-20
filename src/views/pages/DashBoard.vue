<script setup lang="ts">
import { onMounted, ref } from "vue";

// 导入News组件
import News from "@/components/houseDetail/News.vue";

// 其它组件导入
import CategoryCard from "@/components/dashboard/CategoryCard.vue";
import BannerPage from "@/components/dashboard/BannerPage.vue";
import Footer1 from "@/components/footer/Footer1.vue";
import HouseCard from "~/src/components/dashboard/HouseCard.vue";
import CityCard from "~/src/components/dashboard/CityCard.vue";
import SecondHandHouse from "~/src/components/dashboard/SecondHandHouse.vue";
import NewHouseList from "~/src/components/dashboard/NewHouseList.vue";

// 导入fixCardStore
import { useFixCardStore } from '@/stores/fixCardStore'

const fixCardStore = useFixCardStore()
const color = ref('indigo')
const variant = ref('tonal')

onMounted(() => {
  console.log("Dashboard mounted");
});
</script>

<template>
  <div class="pa-5">
    <!-- 顶端放新闻组件 -->
    
    <!-- BannerPage -->
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4" class="full-width-banner">
        <BannerPage></BannerPage>
      </v-col>
    </v-row>
    
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <CityCard></CityCard>
      </v-col>
      <v-col cols="12" xl="4">
       <News/>
      </v-col>
    </v-row>
    
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <SecondHandHouse></SecondHandHouse>
      </v-col>
    </v-row>
    
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <NewHouseList></NewHouseList>
      </v-col>
      
    </v-row>
    
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <Footer1></Footer1>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped></style>
<style scoped>
.fixed-card {
  position: fixed;
  top: 20px; /* 位于 AppBar 下方 */
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  z-index: 1000; /* 确保在最上层 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.full-width-banner :deep(.v-card) {
  width: 100vw !important; /* 强制宽度为100%视口宽度 */
  margin-top: 0% !important; /* 去除顶部间距 */
  position: relative !important;
  left: 50% !important;
  transform: translateX(-50%) !important;

  /* 覆盖 v-card 可能存在的边距和圆角 */
  margin-left: 0 !important;
  margin-right: 0 !important;
  border-radius: 0 !important;
  
  /* 保留你之前CSS中的垂直边距，如果这是你想要的效果 */
  margin-top: 2.5rem; 
  margin-bottom: 2.5rem;

  /* 通常全屏背景 Banner 不需要额外的阴影和内边距 */
  box-shadow: none !important;
  padding: 0 !important; 
}

</style>