<template>
<div class="pa-5">
 <!-- 搜索框 -->
  <v-container fluid class="pa-0">
    <v-card class="mb-5 pa-4" flat tile outlined>
      <v-card-title class="text-h6 font-weight-medium pl-0">
        查找房源
      </v-card-title>
      <v-row align="center" dense>
        <v-col cols="12">
          <v-text-field
            v-model="searchFilters.community"
            label="请输入区域、商圈或小区名开始找房"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            @keyup.enter="applyFiltersAndResetPage"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-3">
        <v-col cols="auto" class="filter-label">按区域:</v-col>
        <v-col>
          <v-chip-group
            v-model="searchFilters.region"
            column
            multiple
            active-class="primary--text"
          >
            <v-chip
              v-for="region in availableRegions"
              :key="region.value"
              :value="region.value"
              label
              small
              filter
            >
              {{ region.text }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-2">
        <v-col cols="auto" class="filter-label">方式:</v-col>
        <v-col>
          <v-chip-group
            v-model="searchFilters.rent_type"
            mandatory
            active-class="primary--text"
          >
            <v-chip value="" label small filter>不限</v-chip>
            <v-chip value="整租" label small filter>整租</v-chip>
            <v-chip value="合租" label small filter>合租</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-2">
        <v-col cols="auto" class="filter-label">租金:</v-col>
        <v-col>
          <v-chip-group
            v-model="selectedRentRange"
            mandatory
            active-class="primary--text"
          >
            <v-chip :value="{ min: undefined, max: undefined }" label small filter>不限</v-chip>
            <v-chip v-for="range in rentRanges" :key="range.label" :value="range.value" label small filter>
              {{ range.label }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="12" md="4" class="d-flex align-center mt-2 mt-md-0">
          <v-text-field
            v-model.number="customMinPrice"
            label="最低价"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            class="mr-2"
            style="max-width: 120px;"
          ></v-text-field>
          <span class="mx-1">-</span>
          <v-text-field
            v-model.number="customMaxPrice"
            label="最高价"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            class="mr-2"
            style="max-width: 120px;"
          ></v-text-field>
          <v-btn small color="primary" variant="outlined" @click="applyCustomPriceRange">确定</v-btn>
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-2">
        <v-col cols="auto" class="filter-label">户型:</v-col>
        <v-col>
          <v-chip-group
            v-model="searchFilters.rooms"
            column
            multiple
            active-class="primary--text"
          >
             <v-chip value="" label small filter>不限</v-chip>
            <v-chip value="一居" label small filter>一居</v-chip>
            <v-chip value="两居" label small filter>两居</v-chip>
            <v-chip value="三居" label small filter>三居</v-chip>
            <v-chip value="四居" label small filter>四居</v-chip>
            <v-chip value="四居+" label small filter>四居+</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      
      <v-row dense align="center" class="mt-2">
        <v-col cols="auto" class="filter-label">朝向:</v-col>
        <v-col>
          <v-chip-group
            v-model="searchFilters.orientation"
            column
            multiple
            active-class="primary--text"
          >
            <v-chip value="" label small filter>不限</v-chip>
            <v-chip v-for="o in orientations" :key="o" :value="o" label small filter>{{ o }}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>


      <v-row dense class="mt-4">
        <v-col>
          <v-btn color="primary" @click="applyFiltersAndResetPage" :loading="loading">
            <v-icon left>mdi-filter-variant</v-icon>
            应用筛选
          </v-btn>
          <v-btn class="ml-2" @click="resetFilters" :disabled="loading">
            <v-icon left>mdi-refresh</v-icon>
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <!-- 房源列表 -->
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
  </v-container>
  
      
    
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { fetchHouses, type HouseInfo, type HouseFilters, type PaginatedHouseResponse } from '@/api/houseApi'; // 假设你创建了这个API文件
// 房源列表
// const fetchArticles = async () => {
//   try {
//     const response = await axios.get("http://localhost:5000/houseinfo");
//     articles.value = response.data.data; // 假设返回的是数组
//     console.log("获取数据成功:", articles.value);
//   } catch (error) {
//     console.error("获取数据失败:", error);
//   }
// };
// const articles =ref<any[]>( [
//   {
//      area: 95.0,
//   available: 1,
//   block: "省政府",
//   community: "北辰中央公园(慧辰园)",
//   decoration: "精装",
//   direction: "南",
//   house_num: "2010951165017063424",
//   id: 44,
//   image_url: "https://i.pinimg.com/736x/78/c3/51/78c351cf9c7ffa68c7b776257e3e54b1.jpg",
//   landlord: "杨公寓",
//   page_views: "1201",
//   phone_num: "18912340027",
//   price: 3000,
//   publish_time: "2025-05-19",
//   region: "天心",
//   rent_type: "整租",
//   rooms: "2室2厅",
//   subway: 0,
//   tag_new: 1,
//   title: "整租·北辰中央公园(慧辰园) 2室2厅 南"
//   }
// ]);


//
const router = useRouter();

const searchFilters = reactive<HouseFilters>({
  page: 1,
  per_page: 12, // 每页显示12条
  community: '', // 用于主搜索框，对应后端的 community, block, region 之一或组合
  region: [], // 对应多选的区域
  rent_type: '', // 整租/合租
  min_price: undefined,
  max_price: undefined,
  rooms: [], // 户型，例如 ['一居', '两居']
  orientation: [], // 朝向
  
});

const houses = ref<HouseInfo[]>([]);
const loading = ref(false);
const pagination = reactive({
  page: 1,
  per_page: 12,
  total: 0,
  pages: 0,
});
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

// 筛选条件数据
const availableRegions = ref([ // 示例数据，应从后端获取或配置
  { text: '岳麓', value: '岳麓' },
  { text: '雨花', value: '雨花' },
  { text: '天心', value: '天心' },
  { text: '芙蓉', value: '芙蓉' },
  { text: '望城', value: '望城' },
  { text: '长沙县', value: '长沙县' }
  // ...更多区域
]);

const rentRanges = ref([
  { label: '≤2000元', value: { min: undefined, max: 2000 } },
  { label: '2000-3000元', value: { min: 2000, max: 3000 } },
  { label: '3000-4000元', value: { min: 3000, max: 4000 } },
  { label: '4000-5000元', value: { min: 4000, max: 5000 } },
  { label: '5000-6000元', value: { min: 5000, max: 6000 } },

  { label: '≥6000元', value: { min: 6000, max: undefined } },
]);
const selectedRentRange = ref<{min: number | undefined, max: number | undefined } | null>(null);
const customMinPrice = ref<number | undefined>();
const customMaxPrice = ref<number | undefined>();
const orientations = ref(['东', '南', '西', '北', '南北', '东西', '东北', '西北', '东南', '西南']);


watch(selectedRentRange, (newRange) => {
  if (newRange) {
    searchFilters.min_price = newRange.min;
    searchFilters.max_price = newRange.max;
    // 如果选择了预设范围，清空自定义价格，避免混淆
    customMinPrice.value = undefined;
    customMaxPrice.value = undefined;
  } else { // "不限"
    searchFilters.min_price = undefined;
    searchFilters.max_price = undefined;
  }
});

const applyCustomPriceRange = () => {
  searchFilters.min_price = customMinPrice.value;
  searchFilters.max_price = customMaxPrice.value;
  // 如果用户输入了自定义价格，取消选择预设范围
  selectedRentRange.value = null; 
  applyFiltersAndResetPage();
}

const loadHouses = async () => {
  loading.value = true;
  try {
    
    const apiFilters: HouseFilters = {
      ...searchFilters,
      page: pagination.page,
      per_page: pagination.per_page,
    };
    // 处理数组类型的筛选条件，如果为空数组则不发送该参数或发送空字符串
    if (Array.isArray(apiFilters.region) && apiFilters.region.length > 0) {
      apiFilters.region = apiFilters.region.join(','); // 或根据后端期望格式调整
    } else {
      delete apiFilters.region; // 如果为空则不发送
    }
    if (Array.isArray(apiFilters.rooms) && apiFilters.rooms.length > 0) {
        // 后端期望的是 rooms.ilike(f"%{request.args['rooms']}%")
        // 如果前端传的是 "一居"，后端会变成 %一居%
        // 如果前端传的是 ["一居", "两居"]，需要考虑后端如何处理多选户型
        // 简单处理：如果多选，可以考虑发送第一个，或后端支持逗号分隔查询
        apiFilters.rooms = apiFilters.rooms.join(','); // 假设后端支持逗号分隔的多户型查询
    } else {
      delete apiFilters.rooms;
    }
     if (Array.isArray(apiFilters.orientation) && apiFilters.orientation.length > 0) {
      apiFilters.orientation = apiFilters.orientation.join(',');
    } else {
      delete apiFilters.orientation;
    }

    // 移除值为 undefined 或空字符串的筛选条件，避免发送无效参数
    for (const key in apiFilters) {
      if (apiFilters[key] === undefined || apiFilters[key] === '' || (Array.isArray(apiFilters[key]) && apiFilters[key].length === 0) ) {
        delete apiFilters[key];
      }
    }

    const response = await fetchHouses(apiFilters);
    houses.value = response.items;
    pagination.total = response.total;
    pagination.pages = response.pages;
    pagination.page = response.page; // 确保前端页码与后端返回一致
    pagination.per_page = response.per_page;

  } catch (error) {
    console.error("Failed to load houses:", error);
    // 可以在这里使用 Snackbar 显示错误信息
    // snackbarStore.showErrorMessage('加载房源失败');
  } finally {
    loading.value = false;
  }
};

const applyFiltersAndResetPage = () => {
  pagination.page = 1; // 筛选条件改变时，回到第一页
  loadHouses();
};

const resetFilters = () => {
  searchFilters.community = '';
  searchFilters.region = [];
  searchFilters.rent_type = '';
  selectedRentRange.value = null; // 会触发 watch 清空 min_price, max_price
  searchFilters.min_price = undefined;
  searchFilters.max_price = undefined;
  customMinPrice.value = undefined;
  customMaxPrice.value = undefined;
  searchFilters.rooms = [];
  searchFilters.orientation = [];
  // ... 重置其他筛选条件
  applyFiltersAndResetPage();
};

const handlePageChange = (newPage: number) => {
  pagination.page = newPage;
  loadHouses();
};

const goToHouseDetail = (houseId: number) => {
  // 假设你的房源详情页路由是 /product/:id (根据你的 router/index.ts)
  // 或者你有一个专门的房源详情页路由如 /house/:id
  // router.push({ name: 'product-details', params: { id: houseId } }); // 如果用 name
  router.push(`/house/${houseId}`); // 如果直接用 path，确保这个路由已定义
};

onMounted(() => {
  loadHouses(); // 页面加载时获取初始数据
  // fetchArticles(); // 获取文章数据
  console.log("Va",houses.value);
});

</script>

<style scoped>
.filter-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 8px;
  white-space: nowrap;
}

.v-chip-group .v-chip {
  margin: 4px;
}
/* 根据你的项目整体风格调整卡片样式 */
.v-card--hover:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
  transform: translateY(-4px);
  transition: all 0.2s ease-in-out;
}
</style>

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