<!--
* @Component: LandlordHouseList
* @Maintainer: J.K. Yang
* @Description: 房东房源管理列表页面
-->
<script setup lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profileStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


// 房源类型定义
interface HouseItem {
  id: number;
  title: string;
  area: number;
  available: number;
  block: string;
  community: string;
  decoration: string;
  direction: string;
  house_num: string;
  image_url: string;
  isavailable: number;
  landlord: string;
  page_views: number | null;
  phone_num: string;
  price: number;
  publish_time: string;
  region: string;
  rent_type: string;
  rooms: string;
  status: number;
  subway: number;
  tag_new: number;
}

const router = useRouter();
const profileStore = useProfileStore();

// 状态管理
const loading = ref(false);
const selected = ref<number[]>([]);
const houses = ref<HouseItem[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const searchQuery = ref('');

// 获取房东名称（从store或其他地方）
const landlordName = computed(() => profileStore.user.name || 'Lappand');

// 获取房源列表
const fetchHouses = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:5000/houseinfo/by_landlord', {
      params: {
        name: landlordName.value,
        page: currentPage.value
      }
    });
    
    if (response.data.code === 200) {
      houses.value = response.data.data.items;
      totalPages.value = response.data.data.pages;
      totalItems.value = response.data.data.total;
    }
  } catch (error) {
    console.error('获取房源列表失败:', error);
    snackbar.show = true;
    snackbar.message = '获取房源列表失败';
    snackbar.color = 'error';
  } finally {
    loading.value = false;
  }
};

// 切换房源状态
const toggleAvailability = async (house: HouseItem) => {
  const newVal = house.isavailable === 1 ? 0 : 1;
  try {
    // >>> 调用后端 PUT 接口
    await axios.put(`http://localhost:5000/houseinfo/${house.id}/isavailable`, {
      isavailable: newVal
    });
    // <<<

    house.isavailable = newVal;               // 乐观更新
    snackbar.show    = true;
    snackbar.message = newVal ? '房源已上架' : '房源已下架';
    snackbar.color   = 'success';

    // 可选：强制刷新列表，确保统计信息同步
    // await fetchHouses();
  } catch (e) {
    console.error(e);
    snackbar.show  = true;
    snackbar.color = 'error';
    snackbar.message = '更新状态失败';
  }
};
//状态
const statusMap = {
  0: { text: '空置',   color: 'grey'   },
  1: { text: '出租中', color: 'green'  },
  2: { text: '维修中', color: 'orange' }
};
// 跳转到房源详情编辑页
const goToHouseDetail = (houseId: number) => {
  router.push(`/landlordUpdate/${houseId}`);
};

// 格式化价格
const formatPrice = (price: number) => {
  return price >= 10000 ? `${(price / 10000).toFixed(1)}万` : `${price}`;
};

// 格式化发布时间
const formatPublishTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return date.toLocaleDateString('zh-CN');
};

// 过滤房源
const filteredHouses = computed(() => {
  if (!searchQuery.value) return houses.value;
  
  const query = searchQuery.value.toLowerCase();
  return houses.value.filter(house => 
    house.title.toLowerCase().includes(query) ||
    house.community.toLowerCase().includes(query) ||
    house.region.toLowerCase().includes(query) ||
    house.block.toLowerCase().includes(query)
  );
});

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

// 统计信息
const statistics = computed(() => {
  const total = houses.value.length;
  const available = houses.value.filter(h => h.isavailable === 1).length;
  const unavailable = total - available;
  const totalViews = houses.value.reduce((sum, h) => sum + (h.page_views || 0), 0);
  
  return { total, available, unavailable, totalViews };
});
//导出函数
const exporting = ref(false);


// 导出Excel功能
const exportToExcel = () => {
  try {
    // 准备导出数据
    exporting.value = true;
    const exportData = houses.value.map((house, index) => ({
      '序号': index + 1,
      '房源标题': house.title,
      '区域': house.region,
      '街道': house.block,
      '小区': house.community,
      '户型': house.rooms,
      '面积(㎡)': house.area,
      '朝向': house.direction,
      '租金(元/月)': house.price,
      '出租方式': house.rent_type,
      '装修情况': house.decoration,
      '状态': house.isavailable === 1 ? '已上架' : '已下架',
      '近地铁': house.subway === 1 ? '是' : '否',
      '浏览量': house.page_views || 0,
      '发布时间': house.publish_time,
      '联系电话': house.phone_num,
      '房源编号': house.house_num
    }));

    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '房源列表');

    // 设置列宽
    const colWidths = [
      { wch: 6 },   // 序号
      { wch: 30 },  // 房源标题
      { wch: 10 },  // 区域
      { wch: 12 },  // 街道
      { wch: 15 },  // 小区
      { wch: 12 },  // 户型
      { wch: 10 },  // 面积
      { wch: 8 },   // 朝向
      { wch: 12 },  // 租金
      { wch: 10 },  // 出租方式
      { wch: 10 },  // 装修情况
      { wch: 10 },  // 状态
      { wch: 8 },   // 近地铁
      { wch: 10 },  // 浏览量
      { wch: 12 },  // 发布时间
      { wch: 15 },  // 联系电话
      { wch: 12 }   // 房源编号
    ];
    ws['!cols'] = colWidths;

    // 生成Excel文件
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // 保存文件
    const fileName = `房源列表_${landlordName.value}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`;
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
    
    snackbar.show = true;
    snackbar.message = '导出成功';
    snackbar.color = 'success';
  } catch (error) {
    console.error('导出失败:', error);
    snackbar.show = true;
    snackbar.message = '导出失败，请重试';
    snackbar.color = 'error';
  }finally {
    exporting.value = false;
  }
};
// 初始化
onMounted(() => {
  fetchHouses();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- 页面标题和统计 -->
        <v-card class="mb-5" elevation="2">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" md="6">
                <h1 class="text-h4 font-weight-bold">
                  <v-icon class="mr-2" size="large">mdi-home-group</v-icon>
                  我的房源
                </h1>
                <p class="text-subtitle-1 text-grey mt-1">
                  管理您发布的所有房源信息
                </p>
              </v-col>
              <v-col cols="12" md="6">
                <v-row dense>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold primary--text">{{ statistics.total }}</div>
                      <div class="text-caption">总房源</div>
                    </div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold success--text">{{ statistics.available }}</div>
                      <div class="text-caption">已上架</div>
                    </div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold error--text">{{ statistics.unavailable }}</div>
                      <div class="text-caption">已下架</div>
                    </div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold info--text">{{ statistics.totalViews }}</div>
                      <div class="text-caption">总浏览</div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- 主列表卡片 -->
        <v-card class="mx-auto" elevation="2">
          <v-toolbar color="primary" dark>
            <v-btn icon="mdi-menu"></v-btn>
            <v-toolbar-title>房源列表</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn 
            size="large"
            variant="outlined" 
            :loading="exporting"
            :disabled="houses.length === 0"
            class="mr-2"
             @click="exportToExcel" 
            >
            <v-icon left>mdi-file-excel</v-icon>
            导出Excel
            </v-btn>
            <!-- 搜索框 -->
            <v-text-field
              v-model="searchQuery"
              hide-details
              prepend-inner-icon="mdi-magnify"
              placeholder="搜索房源.."
              single-line
              variant="solo"
              density="compact"
              clearable
              class="mr-2"
              style="max-width: 300px;"
            ></v-text-field>
            
            <v-btn icon="mdi-refresh" @click="fetchHouses" :loading="loading"></v-btn>
            <v-btn icon="mdi-plus" @click="router.push('/landlordUpload')"></v-btn>
          </v-toolbar>

          <!-- 房源列表 -->
          <v-list v-model:selected="selected" select-strategy="leaf">
            <template v-if="loading">
              <v-skeleton-loader
                v-for="i in 3"
                :key="i"
                type="list-item-three-line"
                class="mx-auto"
              ></v-skeleton-loader>
            </template>
            
            <template v-else-if="filteredHouses.length === 0">
              <v-list-item>
                <div class="text-center py-10 w-100">
                  <v-icon size="64" color="grey">mdi-home-off</v-icon>
                  <p class="text-h6 text-grey mt-3">暂无房源数据</p>
                  <v-btn color="primary" class="mt-3" @click="router.push('/landlordUpload')">
                    <v-icon left>mdi-plus</v-icon>
                    发布新房源
                  </v-btn>
                  
                </div>
              </v-list-item>
                    
            </template>

            <template v-else>
              <v-list-item
                v-for="house in filteredHouses"
                :key="house.id"
                :value="house.id"
                active-class="green-lighten-4"
                class="py-4 house-list-item"
                @click="goToHouseDetail(house.id)"
              >
                <!-- 房源图片 -->
                <template v-slot:prepend>
                  <v-img
                    :src="house.image_url || 'https://via.placeholder.com/120x90?text=暂无图片'"
                    width="120"
                    height="90"
                    cover
                    class="rounded mr-4"
                  ></v-img>
                </template>

                <!-- 房源信息 -->
                <v-list-item-title class="text-h6 mb-1">
                  {{ house.title }}
                  <v-chip
                    v-if="house.tag_new === 1"
                    size="x-small"
                    color="error"
                    class="ml-2"
                  >
                    新
                  </v-chip>
                  <v-chip
                    v-if="house.subway === 1"
                    size="x-small"
                    color="info"
                    class="ml-1"
                  >
                    近地铁
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                  <v-icon size="small">mdi-map-marker</v-icon>
                  {{ house.region }}区 · {{ house.block }} · {{ house.community }}
                  <span class="mx-2">|</span>
                  <v-icon size="small">mdi-home-variant</v-icon>
                  {{ house.rooms }} · {{ house.area }}㎡ · {{ house.direction }}向
                </v-list-item-subtitle>

                <v-list-item-subtitle class="text-high-emphasis">
                  <span class="text-h6 font-weight-bold error--text">
                    ¥{{ formatPrice(house.price) }}
                  </span>
                  <span class="text-caption ml-1">/月</span>
                  <span class="mx-2">|</span>
                  {{ house.rent_type }} · {{ house.decoration }}
                </v-list-item-subtitle>

                <!-- 操作按钮 -->
                <template v-slot:append="{ isSelected }">
                  <v-list-item-action class="flex-column align-end">
                    <small class="mb-2 text-high-emphasis opacity-60">
                      发布于 {{ formatPublishTime(house.publish_time) }}
                    </small>
                    
                    <div class="d-flex align-center">
                      <!-- 浏览量 -->
                      <v-chip  variant="outlined" class="mr-2" rounded="sm">
                        <v-icon size="small" start>mdi-eye</v-icon>
                        {{ house.page_views || 0 }}
                      </v-chip>
                      
                      <!-- 上下架状态切换 -->
                      <v-chip
                        :color="house.isavailable === 1 ? 'success' : 'error'"
                        variant="elevated"
                        @click.stop="toggleAvailability(house)"
                        rounded="sm"
                      >
                        <v-icon start>
                          {{ house.isavailable === 1 ? 'mdi-check-circle' : 'mdi-close-circle' }}
                        </v-icon>
                        {{ house.isavailable === 1 ? '已上架' : '已下架' }}
                      </v-chip>
                                       
                        <v-chip 
                            :color="statusMap[house.status].color"
                            variant="elevated"
                            class="ml-1"
                            rounded="sm">
                        {{ statusMap[house.status].text }}
                      </v-chip>
                    
                      
                    </div>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list>

          <!-- 分页 -->
          <v-divider></v-divider>
          <v-card-actions v-if="totalPages > 1" class="justify-center">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              density="comfortable"
              @update:model-value="fetchHouses"
            ></v-pagination>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<style scoped lang="scss">
.house-list-item {
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.08);
    transform: translateX(4px);
  }
  
  &.v-list-item--active {
    background-color: rgba(76, 175, 80, 0.12) !important;
    border-left: 4px solid #4CAF50;
  }
}

// 绿色波浪效果
.green-lighten-4 {
  background-color: #C8E6C9 !important;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.2), transparent);
    animation: wave 1.5s ease-in-out;
  }
}

@keyframes wave {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>