<script setup lang="ts">
import { ref } from 'vue';

// 定义props
const props = defineProps<{
  house: any;
  detail: any;
}>();

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

const mediaList = computed(() => {
  return form.value.videos.length > 0 ? form.value.videos : form.value.photos;
});


function onBookVisit() {
  // 这里可以放跳转预约页面或者弹窗逻辑
  alert('预约看房功能暂未实现');
}

import { useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

// 获取当前路由的 houseid（即 /house/46 中的 46）
const houseId = route.params.id  
//const rentValue = "10251" // 定义租金数据

const navigateToContract = () => {
  router.push({
    path: '/contract',
    query: { rent: form.value.price ,
            landlord: props.house.landlord,
            phone: props.house.phone_num,
            houseid: houseId 
    } // 通过query参数传递
  })
}

const navigateToChat = () => {
  router.push({
    path: '/chat',
    query: { landlord: props.house.landlord,
            phone: props.house.phone_num
    } // 通过query参数传递
  })
}

const showDatePicker = ref(false);
const selectedDate = ref(null);

const onDateSelected = async (date: string | Date) => {
  console.log("选择的日期是：", date);
  //showDatePicker.value = false; / 选择后隐藏日期选择器

try {
    const response = await fetch('http://localhost:5000/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: "aaaa",
        time: date.toISOString(),
        property: "万科魅力之城武广新城" // 可以添加更多房产信息
      })
    });

    if (!response.ok) {
      throw new Error('网络响应不正常');
    }

    const data = await response.json();
    console.log('后端响应:', data);
    alert('预约日期提交成功！');
    showDatePicker.value = false;
  } catch (error) {
    console.error('提交日期失败:', error);
    alert('提交日期失败，请稍后再试');
  }

};

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

      <v-chip color="green" 
                    variant="outlined"
                    @click="navigateToContract"
                    style="cursor: pointer">立即签约！</v-chip>
                    &nbsp;&nbsp;
      <v-chip color="red" 
                    variant="outlined"
                    @click="navigateToChat"
                    style="cursor: pointer">咨询房东！</v-chip>              
      <br/>

    </div>
    <div class="d-flex align-center mb-3">
      <v-btn
      color="primary"
      class="mt-4"
      large
      @click="showDatePicker = !showDatePicker"
    >
      预约看房
    </v-btn>


    <!-- 背景遮罩 -->
  <div 
    v-if="showDatePicker" 
    class="date-picker-backdrop"
    @click="showDatePicker = false"
  ></div>
  
  <!-- 日期选择器 -->
  <div v-if="showDatePicker" class="date-picker-container">
    <v-card class="date-picker-card" elevation="10" rounded="lg">
      <v-card-actions class="d-flex justify-end pa-0 ma-0">
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="showDatePicker = false"
          class="ma-1"
        ></v-btn>
      </v-card-actions>
      <v-date-picker
        color="primary"
        v-model="selectedDate"
        @update:modelValue="onDateSelected"
        class="pa-2"
        width="100%"
      ></v-date-picker>
    </v-card>
  </div>
     
<br>
    <v-spacer></v-spacer>
    <!--<v-btn
      color="primary"
      class="mt-4"
      large
      @click="onBookVisit"
    >
      联系我们
    </v-btn>-->
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

/*日期选择部分浮动设置*/
.date-picker-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
  padding: 0px;
  border-radius: 5px;
}


/* 日期选择器容器 */
.date-picker-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000 !important;/* 确保高于其他所有元素 */
  width: 90%;
  max-width: 600px;
  isolation: isolate; /* 创建新的堆叠上下文 */
}

/* 日期选择卡片 */
.date-picker-card {
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

/* 背景遮罩 */
.date-picker-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999; /* 比选择器低1层 */
}

/* 响应式调整 */
@media (max-width: 600px) {
  .date-picker-container {
    width: 95%;
  }
  .date-picker-card {
    max-height: 80vh;
  }
}
</style>