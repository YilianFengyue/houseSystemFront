<script setup lang="ts">
import { onMounted } from "vue";

import News from "@/components/houseDetail/News.vue";  // 改成 News

// 其它组件导入保持不变
import CategoryCard from "@/components/dashboard/CategoryCard.vue";
import BannerPage from "@/components/dashboard/BannerPage.vue";

import Footer1 from "@/components/footer/Footer1.vue";
import HouseCard from "~/src/components/dashboard/HouseCard.vue";
import CityCard from "~/src/components/dashboard/CityCard.vue";
import SecondHandHouse from "~/src/components/dashboard/SecondHandHouse.vue";

onMounted(() => {
  console.log("Dashboard mounted");
});
</script>

<template>
  <div class="pa-5">
    <!-- 顶端放新闻组件 -->
    <News />

    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <BannerPage></BannerPage>
      </v-col>
    </v-row>

    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <HouseCard></HouseCard>
      </v-col>
    </v-row>

    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <CityCard></CityCard>
      </v-col>
    </v-row>

    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <SecondHandHouse></SecondHandHouse>
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
