<template>
<div class="pa-5">
  <v-container fluid class="pa-0">
    <v-card class="mb-5 pa-4" flat outlined>
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
            selected-class="text-primary"
          >
            <v-chip
              v-for="region in availableRegions"
              :key="region.value"
              :value="region.value"
              label
              size="small"
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
            selected-class="text-primary"
          >
            <v-chip value="" label size="small" filter>不限</v-chip>
            <v-chip value="整租" label size="small" filter>整租</v-chip>
            <v-chip value="合租" label size="small" filter>合租</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-2">
        <v-col cols="auto" class="filter-label">租金:</v-col>
        <v-col>
          <v-chip-group
            v-model="selectedRentRange"
            mandatory
            selected-class="text-primary"
          >
            <v-chip :value="null" label size="small" filter>不限</v-chip> <v-chip v-for="range in rentRanges" :key="range.label" :value="range.value" label size="small" filter>
              {{ range.label }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="12" md="auto" class="d-flex align-center mt-2 mt-md-0 flex-wrap"> <v-text-field
            v-model.number="customMinPrice"
            label="最低价"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            class="mr-2"
            style="max-width: 100px;"
          ></v-text-field>
          <span class="mx-1 body-1">-</span>
          <v-text-field
            v-model.number="customMaxPrice"
            label="最高价"
            variant="outlined"
            density="compact"
            type="number"
            hide-details
            class="mr-2"
            style="max-width: 100px;"
          ></v-text-field>
          <v-btn size="small" color="primary" variant="outlined" @click="applyCustomPriceRange" class="mt-2 mt-md-0">确定</v-btn>
        </v-col>
      </v-row>

      <v-row dense align="center" class="mt-2">
        <v-col cols="auto" class="filter-label">户型:</v-col>
        <v-col>
          <v-chip-group
            v-model="searchFilters.rooms"
            column
            multiple
            selected-class="text-primary"
          >
            <v-chip value="一居" label size="small" filter>一居</v-chip>
            <v-chip value="两居" label size="small" filter>两居</v-chip>
            <v-chip value="三居" label size="small" filter>三居</v-chip>
            <v-chip value="四居" label size="small" filter>四居</v-chip>
            <v-chip value="四居+" label size="small" filter>四居+</v-chip>
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
            selected-class="text-primary"
          >
            <v-chip v-for="o in orientations" :key="o" :value="o" label size="small" filter>{{ o }}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row dense class="mt-4">
        <v-col>
          <v-btn color="primary" @click="applyFiltersAndResetPage" :loading="loading">
            <v-icon start>mdi-filter-variant</v-icon>
            应用筛选
          </v-btn>
          <v-btn class="ml-2" @click="resetFilters" :disabled="loading">
            <v-icon start>mdi-refresh</v-icon>
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div class="list-container pa-0 pt-5"> <div v-if="loading" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
        <p class="mt-3 text-grey-darken-1">正在加载房源数据...</p>
      </div>

      <v-row v-else-if="houses.length > 0" dense>
        <v-col cols="12" md="8">
          <v-card 
            v-for="house in houses" 
            :key="house.id" 
            class="mb-4 house-card"
            hover
            @click="goToHouseDetail(house.id)"
          >
            <v-row no-gutters>
              <v-col cols="12" sm="4" class="d-flex align-center pa-sm-3 pa-2">
                <v-img
                  cover
                  :src="house.image_url || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'" 
                  aspect-ratio="1.33" rounded="sm"
                  class="house-image"
                ></v-img>
              </v-col>

              <v-col cols="12" sm="8" class="d-flex flex-column justify-space-between pa-3">
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
                    <span>{{ house.area }}m²</span> <span class="mx-1">|</span>
                    <span>{{ house.direction }}</span>
                    <span class="mx-1">|</span>
                    <span>{{ house.decoration || '简装' }}</span> </div>
                
                  <div class="mb-2">
                    <v-chip v-if="house.subway === 1" color="blue-lighten-5" text-color="blue-darken-2" size="small" label class="mr-1 mb-1">近地铁</v-chip>
                    <v-chip v-if="house.tag_new === 1" color="orange-lighten-5" text-color="orange-darken-2" size="small" label class="mr-1 mb-1">新上房源</v-chip>
                    <v-chip v-if="house.available === 1" color="green-lighten-5" text-color="green-darken-2" size="small" label class="mr-1 mb-1">随时可看</v-chip>
                    <v-chip color="cyan-lighten-5" text-color="cyan-darken-2" size="small" label class="mr-1 mb-1">{{ house.rent_type }}</v-chip>
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mt-auto pt-2">
                  <div class="text-caption text-grey-darken-1">
                    <v-icon size="small" start>mdi-account-circle-outline</v-icon>
                    <span>{{ house.landlord || '个人房源' }}</span> <span class="mx-2 VPublishInfoDivider">/</span>
                    <v-icon size="small" start>mdi-clock-time-eight-outline</v-icon>
                    <span>{{ formatPublishTime(house.publish_time) }}</span>
                  </div>
                  <div class="text-h5 font-weight-bold" style="color: #FA5741;">
                    {{ house.price }} <span class="text-subtitle-2">元/月</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
           <v-pagination
            v-if="pagination.pages > 1"
            v-model="pagination.page"
            :length="pagination.pages"
            
            class="mt-5"
            density="compact"
          ></v-pagination>
        </v-col>

        <v-col cols="12" md="4">
            <v-card
              class="mx-auto recommendation-card"
              prepend-icon="mdi-star-circle-outline"
              width="100%" 
            >
              <template v-slot:title>
              <span class="font-weight-black">热门推荐</span>
              </template>
              <v-card-subtitle>周边好房不容错过</v-card-subtitle>
              <v-card-text class="bg-surface-light pt-4">
              这里可以放置热门房源推荐、广告或其他相关信息。
              例如根据当前浏览或筛选条件推荐相似房源。
              </v-card-text>
            </v-card>
        </v-col>
      </v-row>
      
      <v-row v-else-if="!loading && houses.length === 0" dense>
          <v-col cols="12" class="text-center py-10">
            <v-icon size="70" color="grey-lighten-1">mdi-home-alert-outline</v-icon>
            <p class="mt-4 text-h6 text-grey-darken-1">抱歉，没有找到符合条件的房源</p>
            <p class="text-grey">请尝试调整您的筛选条件或稍后再试。</p>
          </v-col>
      </v-row>
    </div>  
  </v-container>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
// Import the actual config type with a different name to avoid conflict with component's filter state type
import { fetchHouses, type HouseInfo, type HouseFilters as ApiHouseFiltersConfig, type PaginatedHouseResponse } from '@/api/houseApi';

const router = useRouter();

// Interface for the component's reactive searchFilters state
interface ComponentSearchFilters {
  page: number;
  per_page: number;
  community: string;    // Main search input
  region: string[];     // Array for multi-select
  rent_type: string;    // Single select (or empty for 'any')
  min_price?: number;
  max_price?: number;
  rooms: string[];      // Array for multi-select
  orientation: string[];// Array for multi-select
}

const searchFilters = reactive<ComponentSearchFilters>({
  page: 1, // Default to page 1 for API, pagination state handles current page
  per_page: 12,
  community: '',
  region: [],
  rent_type: '', // Empty string for '不限' (any)
  min_price: undefined,
  max_price: undefined,
  rooms: [],
  orientation: [],
});

const houses = ref<HouseInfo[]>([]);
const loading = ref(true); // Start with loading true
const pagination = reactive({
  page: 1,
  per_page: searchFilters.per_page, // Align with searchFilters
  total: 0,
  pages: 0,
});

function formatPublishTime(timeStr: string): string {
  if (!timeStr) return '未知';
  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr; // Return original if date is invalid

    const now = new Date();
    const diffTime = now.getTime() - date.getTime(); // No Math.abs, we expect publish_time to be in the past
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) return date.toLocaleDateString(); // Older than 30 days, show date
    if (diffDays >= 1) return `${diffDays}天前发布`;
    if (diffHours >= 1) return `${diffHours}小时前发布`;
    if (diffMinutes >= 1) return `${diffMinutes}分钟前发布`;
    return "刚刚发布";
  } catch (e) {
    return timeStr; // Fallback to original string if any error during parsing
  }
}

const availableRegions = ref([
  { text: '岳麓', value: '岳麓' }, { text: '雨花', value: '雨花' },
  { text: '天心', value: '天心' }, { text: '芙蓉', value: '芙蓉' },
  { text: '望城', value: '望城' }, { text: '长沙县', value: '长沙县' }
]);

const rentRanges = ref([
  { label: '≤2000元', value: { min: undefined, max: 2000 } },
  { label: '2000-3000元', value: { min: 2000, max: 3000 } },
  { label: '3000-4000元', value: { min: 3000, max: 4000 } },
  { label: '4000-5000元', value: { min: 4000, max: 5000 } },
  { label: '5000-6000元', value: { min: 5000, max: 6000 } },
  { label: '≥6000元', value: { min: 6000, max: undefined } },
]);
// For rent range chip group, null value represents "不限"
const selectedRentRange = ref<{min: number | undefined, max: number | undefined } | null>(null);
const customMinPrice = ref<number | undefined>();
const customMaxPrice = ref<number | undefined>();
const orientations = ref(['东', '南', '西', '北', '南北', '东西', '东北', '西北', '东南', '西南']);

watch(selectedRentRange, (newRange) => {
  if (newRange) {
    searchFilters.min_price = newRange.min;
    searchFilters.max_price = newRange.max;
    customMinPrice.value = undefined; // Clear custom if preset is selected
    customMaxPrice.value = undefined;
  } else { // "不限" (null) selected
    searchFilters.min_price = undefined;
    searchFilters.max_price = undefined;
  }
});

const applyCustomPriceRange = () => {
  // Basic validation for custom price
  if (customMinPrice.value !== undefined && customMaxPrice.value !== undefined && customMinPrice.value > customMaxPrice.value) {
    // Handle error - e.g., show a snackbar
    console.error("最低价不能高于最高价");
    return;
  }
  searchFilters.min_price = customMinPrice.value;
  searchFilters.max_price = customMaxPrice.value;
  selectedRentRange.value = null; // Deselect preset range chip
  applyFiltersAndResetPage();
}

const loadHouses = async () => {
  loading.value = true;
  try {
    // Prepare API parameters from component's searchFilters state
    const apiParams: ApiHouseFiltersConfig = {
      page: pagination.page,
      per_page: pagination.per_page,
    };

    if (searchFilters.community) apiParams.community = searchFilters.community;
    if (searchFilters.rent_type) apiParams.rent_type = searchFilters.rent_type;
    if (searchFilters.min_price !== undefined) apiParams.min_price = searchFilters.min_price;
    if (searchFilters.max_price !== undefined) apiParams.max_price = searchFilters.max_price;

    if (searchFilters.region && searchFilters.region.length > 0) {
      apiParams.region = searchFilters.region.join(',');
    }
    if (searchFilters.rooms && searchFilters.rooms.length > 0) {
      apiParams.rooms = searchFilters.rooms.join(',');
    }
    if (searchFilters.orientation && searchFilters.orientation.length > 0) {
      apiParams.orientation = searchFilters.orientation.join(',');
    }

    // Note: Boolean filters like 'subway' or 'available' are not in current searchFilters
    // If you add them, ensure they are converted to 0/1 if backend expects numbers.

    const response = await fetchHouses(apiParams);
    houses.value = response.items;
    pagination.total = response.total;
    pagination.pages = response.pages;
    pagination.page = response.page; // Sync with backend's current page
    pagination.per_page = response.per_page;

  } catch (error) {
    console.error("Failed to load houses in component:", error);
    houses.value = []; // Clear houses on error
    pagination.total = 0;
    pagination.pages = 0;
    // snackbarStore.showErrorMessage('加载房源失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};
// **新增/修改：使用 watch 来处理分页变化**
watch(() => pagination.page, (newPage, oldPage) => {
  if (newPage !== oldPage && !loading.value) { // 确保页码确实改变了，并且当前没有在加载中
    loadHouses();
  }
});

const applyFiltersAndResetPage = () => {
  pagination.page = 1; // Reset to first page when filters change
  loadHouses();
};

const resetFilters = () => {
  searchFilters.community = '';
  searchFilters.region = [];
  searchFilters.rent_type = ''; // Reset to "不限"
  selectedRentRange.value = null; // This will trigger watch to clear min/max price in searchFilters
  customMinPrice.value = undefined;
  customMaxPrice.value = undefined;
  searchFilters.rooms = [];
  searchFilters.orientation = [];
  
  // Ensure min_price and max_price are cleared if not handled by selectedRentRange watch
  searchFilters.min_price = undefined; 
  searchFilters.max_price = undefined;

  applyFiltersAndResetPage();
};

const handlePageChange = (newPage: number) => {
  if (pagination.page !== newPage) {
    pagination.page = newPage;
    loadHouses();
  }
};

const goToHouseDetail = (houseId: number) => {
  router.push(`/house/${houseId}`); // Ensure this route is defined in your router
};

onMounted(async () => {
  await loadHouses();
  console.log("Houses data after initial load:", houses.value);
});

</script>

<style scoped>
.filter-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65); /* Slightly darker for better contrast */
  margin-right: 8px;
  white-space: nowrap;
  align-self: center; /* Align with chips vertically */
}

.v-chip-group .v-chip {
  margin: 4px !important; /* ensure spacing */
}

.house-card {
  border: 1px solid #e0e0e0; /* Subtle border */
}
.house-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.12) !important;
  transform: translateY(-3px);
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.list-container {
  /* If you need specific styling for the list area */
}
.recommendation-card {
  border: 1px solid #e0e0e0;
}
</style>

<style scoped lang="scss">
// Scoped SCSS can go here if needed, original styles were mostly CSS
.house-image {
  border: 1px solid #eee; 
}
.house-title-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 1; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4; /* Adjust for desired spacing */
  // min-height: calc(1.25rem * 1.4); /* text-h6 font-size (1.25rem default) * line-height */
  // The above min-height might be too specific, Vuetify usually handles heights.
}

// Responsive custom price input area
@media (max-width: 959px) { // Vuetify's 'md' breakpoint
  .d-flex.align-center.flex-wrap .v-text-field {
    max-width: calc(50% - 20px) !important; /* Adjust for spacing */
    flex-basis: calc(50% - 20px) !important;
  }
  .d-flex.align-center.flex-wrap .v-btn {
    width: 100%;
    margin-top: 8px;
  }
}
</style>