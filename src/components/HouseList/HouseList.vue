<script setup lang="ts">
import { ref, onMounted } from "vue"; // 确保 ref 已导入


// 定义房源数据接口，匹配你的后端JSON结构
interface HouseInfo {
  id: number;
  title: string;
  area: number;
  available: number; // 1 表示可用, 0 表示不可用
  block: string;
  community: string;
  decoration: string;
  direction: string;
  house_num: string;
  image_url?: string;
  landlord?: string;
  page_views?: string;
  phone_num?: string;
  price: number;
  publish_time: string; // 格式如 "2025-05-19"
  region: string;
  rent_type: string; // 例如 "整租"
  rooms: string; // 例如 "2室2厅"
  subway: number; // 1 表示近地铁, 0 表示否
  tag_new: number; // 1 表示新上, 0 表示否
}

// 模拟从后端获取的数据列表，你应该用API调用替换它
const houses = ref<HouseInfo[]>([]);
const loading = ref(true); // 加载状态

// 模拟后端返回的JSON数据中的一项，用于填充假数据
const sampleHouseData: HouseInfo = {
  area: 95.0,
  available: 1,
  block: "省政府",
  community: "北辰中央公园(慧辰园)",
  decoration: "精装",
  direction: "南",
  house_num: "2010951165017063424",
  id: 44,
  image_url: "https://i.pinimg.com/736x/78/c3/51/78c351cf9c7ffa68c7b776257e3e54b1.jpg",
  landlord: "杨公寓",
  page_views: "1201",
  phone_num: "18912340027",
  price: 3000,
  publish_time: "2025-05-19",
  region: "天心",
  rent_type: "整租",
  rooms: "2室2厅",
  subway: 0,
  tag_new: 1,
  title: "整租·北辰中央公园(慧辰园) 2室2厅 南"
};






function goToHouseDetail(houseId: number) {
  console.log(`Navigating to house detail for ID: ${houseId}`);
  // 实际跳转逻辑，例如:
  // router.push(`/house/${houseId}`); // 假设你的详情页路由是 /house/:id
  alert(`即将跳转到房源 ${houseId} 的详情页 (实际功能待实现)`);
}

// 辅助函数：将 publish_time 转换为更友好的格式，例如 "X天前发布"
// 你可以使用 moment.js (项目中已引入) 或 date-fns
function formatPublishTime(timeStr: string): string {
  // 简单实现，实际中建议使用日期库
  const date = new Date(timeStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "1天内发布";
  if (diffDays <= 7) return `${diffDays}天前发布`;
  return timeStr; // 或者更早的显示具体日期
}

</script>

<template>
<div class="pa-5">
  <div v-if="loading" class="text-center my-10">
    <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
    <p class="mt-3 text-grey-darken-1">正在加载房源数据...</p>
  </div>

  <v-row v-else-if="houses.length > 0" class="flex-0" dense>
    <v-col cols="12" md="8">
      <v-card 
        v-for="house in houses" 
        :key="house.id" 
        class="mb-4 house-card" 
       
        @click="goToHouseDetail(house.id)"
      >
        <v-row no-gutters>
          <v-col cols="12" sm="4" md="4" class="d-flex align-center pa-sm-3 pa-2">
            <v-img
              cover
              :src="house.image_url || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'" 
              aspect-ratio="1.38"
              rounded="sm"
              class="house-image"
            ></v-img>
          </v-col>

          <v-col cols="12" sm="8" md="8" class="d-flex flex-column justify-space-between pa-3">
            <div>
              <v-card-title class="pa-0 mb-1 text-h6 font-weight-bold house-title-clamp">
                {{ house.title }}
              </v-card-title>
              
              <v-card-subtitle class="pa-0 mb-2 text-body-2 text-grey-darken-1">
                {{ house.community }} {{ house.block ? `- ${house.block}` : '' }}
              </v-card-subtitle>

              <div class="text-body-2 text-grey-darken-2 mb-2">
                <span>{{ house.rooms }}</span>
                <span class="mx-1">|</span>
                <span>{{ house.area }}平米</span>
                <span class="mx-1">|</span>
                <span>{{ house.direction }}</span>
                <span class="mx-1">|</span>
                <span>{{ house.decoration }}</span>
                </div>
            
              <div class="mb-2">
                <v-chip v-if="house.subway === 1" color="blue-lighten-5" text-color="blue-darken-2" size="small" label class="mr-1 mb-1">近地铁</v-chip>
                <v-chip v-if="house.tag_new === 1" color="orange-lighten-5" text-color="orange-darken-2" size="small" label class="mr-1 mb-1">新上房源</v-chip>
                <v-chip v-if="house.available === 1" color="green-lighten-5" text-color="green-darken-2" size="small" label class="mr-1 mb-1">随时可看</v-chip>
                <v-chip color="cyan-lighten-5" text-color="cyan-darken-2" size="small" label class="mr-1 mb-1">{{ house.rent_type }}</v-chip>

              </div>
            </div>

            <div class="d-flex justify-space-between align-center mt-auto pt-2">
              <div class="text-caption text-grey-darken-1">
                <v-icon small start>mdi-account-circle-outline</v-icon>
                <span>{{ house.landlord || '个人' }}</span>
                <span class="mx-2">/</span>
                <v-icon small start>mdi-clock-time-eight-outline</v-icon>
                <span>{{ formatPublishTime(house.publish_time) }}</span>
              </div>
              <div class="text-h5 font-weight-bold" style="color: #FA5741;">
                {{ house.price }} <span class="text-subtitle-2">元/月</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
        <v-card
            class="mx-auto"
            prepend-icon="$vuetify"
            subtitle="The #1 Vue UI Library"
            width="100%" 
        >
            <template v-slot:title>
            <span class="font-weight-black">热门推荐</span>
            </template>

            <v-card-text class="bg-surface-light pt-4">
            这里可以放置热门房源推荐、广告或其他相关信息。
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!
            </v-card-text>
        </v-card>
    </v-col>
  </v-row>
  
  <v-row v-else-if="!loading && houses.length === 0" class="flex-0" dense>
      <v-col cols="12" class="text-center py-10">
          <v-icon size="70" color="grey-lighten-1">mdi-home-alert-outline</v-icon>
          <p class="mt-4 text-h6 text-grey-darken-1">暂无房源信息</p>
          <p class="text-grey">请稍后再试或调整您的搜索条件。</p>
      </v-col>
  </v-row>

  </div>
</template>

<style scoped lang="scss">
.house-card {
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    box-shadow: 0 6px 12px rgba(0,0,0,0.1) !important;
    transform: translateY(-3px);
  }
}
.house-image {
  border: 1px solid #eee; // 给图片一个细边框
}
.house-title-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 1; // 标题限制为1行
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  min-height: 1.5em * 1.25; // text-h6的font-size是1.25rem, line-height是1.5倍，确保一行高度
}
</style>