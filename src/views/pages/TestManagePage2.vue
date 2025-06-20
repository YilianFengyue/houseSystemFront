<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios'; // 确保你已经安装并配置了 axios

import { useRouter } from 'vue-router';
const router = useRouter();

const goUserManage  = () => router.push('/userManage');
const goTestManage2 = () => router.push('/testManagePage2');

// --- 1. 类型定义 ---
// 定义房源基本信息类型
interface HouseInfo {
  id: number;
  title: string;
  price: number;
  area: number;
  community: string;
  region: string | null;
  rooms: string;
  rent_type: string;
  image_url: string;
  landlord: string;
  phone_num: string;
  publish_time: string;
  available: 0 | 1; 
  subway: 0 | 1;
   isavailable: 0 | 1;     // ← 上下架
  status: 0 | 1 | 2;      // ← 房屋状态
  [key: string]: any; // 允许其他字段
}

// 定义房源详细信息类型
interface HouseDetail {
  photos: string[];
  facilities: Record<string, boolean>;
  // 其他详细字段可以加在这里
}


// --- 2. 响应式状态定义 ---
const loading = ref(true);
const houseList = ref<HouseInfo[]>([]);
const totalRows = ref(0);

// 分页与搜索参数
const queryOptions = reactive({
  search: "", // 用于搜索标题、小区等
  page: 1,
  itemsPerPage: 10,
});

// 表格头部定义
const headers = [
  { title: "ID", key: "id", align: 'start', sortable: false },
  { title: "封面图", key: "image_url", align: 'center', sortable: false },
  { title: "房源标题", key: "title", align: 'start', sortable: false, width: '300px' },
  { title: "小区/区域", key: "community", align: 'start', sortable: false },
  { title: "价格(元/月)", key: "price", align: 'center', sortable: true },
  { title: "户型", key: "rooms", align: 'center', sortable: false },
  { title: "发布时间", key: "publish_time", align: 'center', sortable: true },
  { title: "房屋状态", key: "status", align: "center" }, 
  { title: "上下架", key: "isavailable", align: 'center', sortable: false },
  { title: "操作", key: "actions", align: 'center', sortable: false, width: '220px' },
];

// 房源详情对话框相关状态
const detailDialog = ref(false);
const selectedHouse = ref<HouseInfo | null>(null);
const houseDetail = ref<HouseDetail | null>(null);
const detailLoading = ref(false);


// --- 3. API 调用与业务逻辑 ---

const API_BASE_URL = 'http://localhost:5000'; // 你的后端API基础地址

// 获取房源列表
const getHouseListings = async () => {
  loading.value = true;
  try {
    const params = {
      page: queryOptions.page,
      per_page: queryOptions.itemsPerPage,
      community: queryOptions.search, // 将搜索框的值映射到后端的 community 参数
    };
    const response = await axios.get(`${API_BASE_URL}/houseinfo/`, { params });
    if (response.data && response.data.code === 200) {
      houseList.value = response.data.data.items;
      totalRows.value = response.data.data.total;
    } else {
      // 可以在这里添加错误提示，例如使用 Snackbar
      console.error("获取房源列表失败:", response.data.message);
      houseList.value = [];
      totalRows.value = 0;
    }
  } catch (error) {
    console.error("请求房源列表时出错:", error);
    // 添加错误提示
  } finally {
    loading.value = false;
  }
};

// v-data-table-server 的 options 更新事件处理器
const onUpdateOptions = async (options: { page: number; itemsPerPage: number; sortBy: any[] }) => {
  queryOptions.page = options.page;
  queryOptions.itemsPerPage = options.itemsPerPage;
  // 注意：后端目前是按发布时间固定排序，如果需要前端控制排序，需要修改此处和后端接口
  await getHouseListings();
};

// 搜索触发
const handleSearch = () => {
  queryOptions.page = 1; // 每次新搜索都回到第一页
  getHouseListings();
}

// 切换房源上架状态 (审核)
const updateHouseStatus = async (house: HouseInfo) => {
 const newVal = house.isavailable === 1 ? 0 : 1;
  const backup = house.isavailable;
  house.isavailable = newVal;               // 乐观更新
  try {
    const res = await axios.put(
      `${API_BASE_URL}/houseinfo/${house.id}/isavailable`,
      { isavailable: newVal }
    );
    if (res.data.code !== 200 && res.data.code !== 202) {
      throw new Error(res.data.message);
    }
  } catch (e) {
    console.error("上下架失败:", e);
    house.isavailable = backup;             
  }
};


// 下架（删除）房源
const deleteHouse = async (houseId: number) => {
  // 这里可以集成一个确认对话框
  if (confirm(`确定要下架 ID 为 ${houseId} 的房源吗？`)) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/houseinfo/${houseId}`);
      if (response.data.code === 200) { // 假设删除成功返回 200 或 204
        // 刷新列表
        getHouseListings();
        // 添加成功提示
      } else {
        console.error("下架房源失败:", response.data.message);
        // 添加错误提示
      }
    } catch (error) {
      console.error("下架房源时出错:", error);
    }
  }
};

// 查看房源详情
const showDetails = async (house: HouseInfo) => {
  selectedHouse.value = house;
  detailDialog.value = true;
  detailLoading.value = true;
  houseDetail.value = null; // 重置详情
  try {
    // 并行获取 house_info 和 house_detail (如果需要最新的 house_info)
    const detailResponse = await axios.get(`${API_BASE_URL}/housedetail/${house.id}`);
    if (detailResponse.data.code === 200) {
      houseDetail.value = detailResponse.data.data;
    } else {
      console.error("获取详情失败:", detailResponse.data.message);
    }
  } catch (error) {
    console.error("获取详情时出错:", error);
  } finally {
    detailLoading.value = false;
  }
};

onMounted(() => {
    // 组件挂载时不需要立即加载，v-data-table-server会触发 onUpdateOptions
});

</script>

<template>
  <div class="pa-5">
    <v-card>
      <v-card-title class="font-weight-bold d-flex align-center">
        <span>房源管理审核</span>
        <v-spacer></v-spacer>
        <div style="width: 300px;">
          <v-text-field
            v-model="queryOptions.search"
            variant="solo"
            prepend-inner-icon="mdi-magnify"
            label="按小区、标题等搜索"
            single-line
            hide-details
            clearable
            density="compact"
            @keydown.enter="handleSearch"
            @click:clear="handleSearch"
          ></v-text-field>
        </div>
        <v-btn color="primary" class="ml-4" @click="handleSearch">搜索</v-btn>
        <v-btn color="primary" variant="elevated" class="ml-2" @click="goTestManage2">
          进入
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-data-table-server
        :headers="headers"
        :items="houseList"
        :items-length="totalRows"
        :loading="loading"
        :items-per-page="queryOptions.itemsPerPage"
        item-value="id"
        @update:options="onUpdateOptions"
        fixed-header
        height="calc(100vh - 220px)"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>#{{ item.id }}</td>
            <td class="pa-2 text-center">
              <v-img
                :src="item.image_url"
                height="80"
                width="120"
                cover
                class="rounded-lg"
              />
            </td>
            <td class="font-weight-bold">{{ item.title }}</td>
            <td>
              <div>{{ item.community }}</div>
              <div class="text-grey">{{ item.region }}</div>
            </td>
            <td class="text-center font-weight-bold text-red">¥{{ item.price }}</td>
            <td class="text-center">{{ item.rooms }}</td>
            <td class="text-center">{{ item.publish_time }}</td>
            <!-- 房屋状态 Chip -->
            <td class="text-center">
              <v-chip
                :color="{
                  0: 'grey',
                  1: 'green',
                  2: 'orange'
                }[item.status]"
                size="small"
                label
              >
                {{
                  { 0: '空置', 1: '出租中', 2: '维修中' }[item.status]
                }}
              </v-chip>
            </td>
            
            <td class="text-center">
              <v-chip
                :color="item.isavailable === 1 ? 'green' : 'orange'"
                size="small"
                label
              >
                {{ item.isavailable === 1 ? '已上架' : '待审核' }}
              </v-chip>
            </td>
            <td class="text-center">
               <v-btn variant="text" size="small" color="primary" @click="showDetails(item)">
                详情
              </v-btn>
              <v-switch
                :model-value="item.isavailable === 1"
                @update:modelValue="updateHouseStatus(item)"
                color="green"
                hide-details
                inset
                class="d-inline-flex ml-2"
                :title="item.available === 1 ? '点击下架' : '点击上架'"
              ></v-switch>
              <v-btn variant="text" size="small" color="red" @click="deleteHouse(item.id)">
                下架
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table-server>
    </v-card>

    <v-dialog v-model="detailDialog" max-width="900px">
      <v-card :loading="detailLoading">
        <v-card-title>
          <span class="text-h5">房源详情 (ID: {{ selectedHouse?.id }})</span>
        </v-card-title>
        <v-card-text v-if="selectedHouse && houseDetail">
           <v-carousel show-arrows="hover" cycle hide-delimiters>
              <v-carousel-item
                v-for="(photo, i) in houseDetail.photos"
                :key="i"
                :src="photo"
                cover
              ></v-carousel-item>
            </v-carousel>

           <v-list lines="two">
            <v-list-item title="标题" :subtitle="selectedHouse.title"></v-list-item>
             <v-list-item title="地址" :subtitle="`${selectedHouse.region || ''} ${selectedHouse.community}`"></v-list-item>
             <v-list-item title="价格" :subtitle="`¥${selectedHouse.price} /月`"></v-list-item>
             <v-list-item title="房东" :subtitle="`${selectedHouse.landlord} (电话: ${selectedHouse.phone_num})`"></v-list-item>
           </v-list>

           <v-divider class="my-4"></v-divider>

            <h4 class="text-h6 mb-2">配套设施</h4>
            <div class="d-flex flex-wrap">
              <v-chip
                v-for="(has, facility) in houseDetail.facilities"
                :key="facility"
                :color="has ? 'primary' : 'grey'"
                class="ma-1"
                label
              >
                {{ facility }}
              </v-chip>
            </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="detailDialog = false">
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
// 如果需要自定义样式，可以写在这里
// 例如，让 v-switch 在表格中垂直居中
.d-inline-flex {
  vertical-align: middle;
}
</style>