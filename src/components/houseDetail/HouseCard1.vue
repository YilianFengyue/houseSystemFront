<script setup lang="ts">
import { ref } from 'vue';
defineProps<{
  house: any,
  detail: any
}>()
// const house =ref( 
  
//   {
//         area: 73.0,
//         available: 1,
//         block: "树木岭",
//         community: "锦源小区",
//         decoration: "精装",
//         direction: "南",
//         house_num: "10001",
//         id: 1,
//         image_url: "https://i.pinimg.com/736x/c4/3a/90/c43a90fcf336e05d7f849b527f067464.jpg",
//         landlord: "张先生",
//         page_views: "108次浏览",
//         phone_num: "13800001234",
//         price: 1600,
//         publish_time: "2025-05-15",
//         region: "雨花",
//         rent_type: "整租",
//         rooms: "2室1厅1卫",
//         subway: 1,
//         tag_new: 1,
//         title: "整租·锦源小区 2室1厅 南"
//   },
// );

// const detail=ref( 
//   {
//         created_at: "2025-05-22T21:32:16",
//         detail_id: 1,
//         facilities: {
//             tv: true,
//             washer: true,
//             wifi: true
//         },
//         house_info_id: 1,
//         map_coordinates: 222,
//         photos: [
//             "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
//             "https://images.unsplash.com/photo-1494526585095-c41746248156",
//             "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
//         ],
//         updated_at: "2025-05-22T21:34:28"
//   },
// );
const form = ref({
  house_num: '',
  title: '整租·锦源小区 2室1厅 南',
  region: '雨花',
  block: '树木岭',
  community: '锦源小区',
  area: 80,
  direction: '南',
  rooms: '2室1厅1卫',
  price: 3200,
  rent_type: '整租',
  decoration: '精装',
  subway: 1,
  available: 1,
  tag_new: 1,
  landlord: '张先生',
  phone_num: '13888888888',
  photos: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1494526585095-c41746248156',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e'
  ],
  videos: [] // 例子里没视频，优先展示此字段
});

const currentSlide = ref(0);



function onBookVisit() {
  // 这里可以放跳转预约页面或者弹窗逻辑
  alert('预约看房功能暂未实现');
}
</script>

<template>
  <v-card class="my-5 pa-5" rounded>
    <v-row>
      <!-- 左侧大图轮播 -->
      <v-col cols="12" md="6">
        <v-carousel
          v-model="currentSlide"
          height="400"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(item, index) in detail.photos"
            :key="index"
          >
            <img
              :src="item"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </v-carousel-item>
        </v-carousel>

        <!-- 下方缩略图 -->
        <v-row class="mt-3" dense justify="center">
      <v-col
        v-for="(item, index) in detail.photos"
        :key="'thumb-' + index"
        cols="3"
        class="d-flex justify-center"
      >
        <v-img
          :src="item"
          :class="currentSlide === index ? 'border border-primary' : ''"
          style="cursor: pointer"
          height="60"
          width="100"
          cover
          @click="currentSlide = index"
        />
      </v-col>
    </v-row>

      </v-col>

      <!-- 右侧信息区域 -->
     <v-col cols="12" md="6" class="d-flex align-center">
  <div style="width: 100%; max-width: 500px; margin: auto; line-height: 1.6;">
    <h2 class="text-h4 font-weight-bold mb-5">{{ house.title }}</h2>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
      <span>位置：{{ house.region }}区 · {{ house.block }}街道 · {{ form.community }}</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-ruler-square</v-icon>
      <span>面积：{{ house.area }}㎡</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-compass-outline</v-icon>
      <span>朝向：{{ house.direction }}</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-home-floor-2</v-icon>
      <span>户型：{{ house.rooms }}</span>
    </div>

    <div class="d-flex align-center mb-3" style="color: #d32f2f; font-weight: 600;">
      <v-icon color="#d32f2f" class="mr-2">mdi-cash</v-icon>
      <span>租金：{{ house.price }} 元/月</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
      <span>租赁方式：{{ house.rent_type }}</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-brush</v-icon>
      <span>装修：{{ house.decoration }}</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-subway-variant</v-icon>
      <span>是否近地铁：{{ house.subway ? '是' : '否' }}</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-eye-check</v-icon>
      <span>是否随时看房：{{ house.available ? '是' : '否' }}</span>
    </div>

    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="mr-2">mdi-account</v-icon>
      <span>房东：{{ house.landlord }}（{{ house.phone_num }}）</span>
    </div>
    <div class="d-flex align-center mb-3">
    <v-btn
      color="primary"
      class="mt-4"
      large
      @click="onBookVisit"
    >
      预约看房
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      color="primary"
      class="mt-4"
      large
      @click="onBookVisit"
    >
      联系我们
    </v-btn>
    </div>
  </div>
</v-col>

    </v-row>
  </v-card>
</template>

<style scoped>
.text-red {
  color: #e53935;
}
</style>
