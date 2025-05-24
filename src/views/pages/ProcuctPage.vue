<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

import HouseCard1 from "~/src/components/houseDetail/HouseCard1.vue";
import Newsletter2 from "~/src/components/houseDetail/Newsletter2.vue";
import Feature5 from "~/src/components/houseDetail/Feature5.vue";
import HouseFacilities from "~/src/components/houseDetail/HouseFacilities.vue";
import Map from "~/src/components/dashboard/Map.vue";
import { onMounted } from "vue";
const route = useRoute();
const id = route.params.id;

const detail = ref({ // 这是你给的示例数据结构
  created_at: "2025-05-22T21:32:16",
  detail_id: 1,
  facilities: { // 这个对象会传递给 AmenitiesDisplay 组件
    tv: true,
    washer: true,
    wifi: true,
    refrigerator: true, // 添加一些来测试
    bed: true,
    airconditioner: false // 这个不会显示
  },
  house_info_id: 1,
  map_coordinates: { lat: 30.0, lng: 120.0 }, // 修正了下 map_coordinates 格式
  photos: [ /* ... */ ],
  updated_at: "2025-05-22T21:34:28"
});
const house =ref( 
  
  {
        area: 73.0,
        available: 1,
        block: "树木岭",
        community: "锦源小区",
        decoration: "精装",
        direction: "南",
        house_num: "10001",
        id: 1,
        image_url: "https://i.pinimg.com/736x/c4/3a/90/c43a90fcf336e05d7f849b527f067464.jpg",
        landlord: "张先生",
        page_views: "108次浏览",
        phone_num: "13800001234",
        price: 1600,
        publish_time: "2025-05-15",
        region: "雨花",
        rent_type: "整租",
        rooms: "2室1厅1卫",
        subway: 1,
        tag_new: 1,
        title: "整租·锦源小区 2室1厅 南"
  },
);
const fetchHouce = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/houseinfo/${house.value.id}`);
    house.value = response.data.data; // 假设返回的是数组
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};
const fetchHouseDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/housedetail/${house.value.id}`);
    detail.value = response.data.data; // 假设返回的是数组
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};
onMounted(() => {
  console.log("Dashboard mounted");
  fetchHouce();
  fetchHouseDetail();
});
</script>

<template>
  <div class="pa-5">
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
         <HouseCard1 :house="house" :detail="detail" />
      </v-col>
      <v-col cols="12" xl="4">
          <HouseFacilities :facilities="detail.facilities" />
      </v-col>
      <v-col cols="12" xl="4">
          <Map :address="`湖南省长沙市${house.region}${house.block}${house.community}`" />
      </v-col>
      <v-col cols="12" xl="4">
        <Feature5 />
        <Newsletter2 />
      </v-col>
    </v-row>
  </div>
</template>
