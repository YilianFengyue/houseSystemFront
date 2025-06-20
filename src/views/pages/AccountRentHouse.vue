<!--
* @Component: 用户租房列表
* @Maintainer: J.K. Yang
* @Description: 显示当前用户租赁的房源列表
-->
<script setup lang="ts">
import { useProfileStore } from "@/stores/profileStore";
import { useFixCardStore } from "@/stores/fixCardStore";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

import contract from "@/components/HouseRentCotract.vue";
const showContractDialog = ref(false);
// 定义房源类型
interface RentalProperty {
  id: number;
  title: string;
  region: string;
  purpose: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'upcoming';
  landlord_username: string;
  rentValue: string;
  landlordPhone: string;
}

// 获取当前用户
const profileStore = useProfileStore();
const currentUser = ref(profileStore.user.name);

// 获取报修卡片store
const fixCardStore = useFixCardStore();

// 当前选中的房源信息
const selectedProperty = ref<RentalProperty | null>(null);

// 房源数据
const rentalProperties = ref<RentalProperty[]>([]);

// 加载状态
const loading = ref(false);
const error = ref(null);

// 从后端获取房源数据
const fetchRentalProperties = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://localhost:5000/rental/tenants/${currentUser.value}`);
    if (response.data.success && response.data.code === 200) {
      // 转换数据格式并计算状态
      rentalProperties.value = response.data.data.map(property => {
        const currentDate = new Date(property.currentDate);
        const startDate = new Date(property.startDate);
        const endDate = new Date(property.endDate);
        
        let status: 'active' | 'expired' | 'upcoming' = 'active';
        if (currentDate > endDate) {
          status = 'expired';
        } else if (currentDate < startDate) {
          status = 'upcoming';
        }
        
        return {
          id: property.id,
          title: property.title,
          region: property.region,
          purpose: property.purpose,
          startDate: property.startDate,
          endDate: property.endDate,
          status: status,
          landlord_username: property.landlord_username,
          rentValue: property.rentValue,
          landlordPhone: property.landlordPhone
        };
      });
    }
  } catch (err) {
    error.value = err.message || '获取房源数据失败';
    console.error('获取房源数据失败:', err);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchRentalProperties();
});

const searchKey = ref("");

// 根据搜索关键词过滤房源列表
const filteredProperties = computed(() => {
  return rentalProperties.value.filter(property => {
    return (
      property.title.toLowerCase().includes(searchKey.value.toLowerCase()) ||
      property.region.toLowerCase().includes(searchKey.value.toLowerCase()) ||
      property.landlord_username.toLowerCase().includes(searchKey.value.toLowerCase()) ||
      property.landlordPhone.toLowerCase().includes(searchKey.value.toLowerCase())
    );
  });
});

// 获取状态对应的颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'error';
    case 'upcoming':
      return 'warning';
    default:
      return 'info';
  }
};

// 打开报修/投诉弹窗
const openFixCard = (property: RentalProperty, type: 'repair' | 'complain') => {
  selectedProperty.value = property;
  fixCardStore.setCurrentProperty(property);
  fixCardStore.setFixType(type);
  fixCardStore.toggleFixCard();
};
</script>

<template>
  <v-card height="100%">
    <!-- 标题和搜索框 -->
    <v-card-title class="d-flex align-center">
      <span class="text-h5">{{ currentUser }}的租房列表</span>
      <v-spacer></v-spacer>
      <v-text-field
        clearable
        variant="solo"
        class="elevation-1"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="搜索房源/房东/电话"
        v-model="searchKey"
        style="max-width: 300px;"
      ></v-text-field>
    </v-card-title>

    <!-- 加载状态 -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <!-- 错误提示 -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="ma-3"
    >
      {{ error }}
    </v-alert>

    <!-- 房源列表 -->
    <perfect-scrollbar class="property-list">
      <transition-group name="fade">
        <v-card
          v-for="property in filteredProperties"
          :key="property.id"
          class="ma-3"
          elevation="2"
        >
          <div class="property-item d-flex align-start pa-4">
            <!-- 房源图片占位 -->
            <v-avatar size="120" rounded="lg" class="mr-4">
              <v-img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="房源图片" />
            </v-avatar>
            
            <!-- 房源信息 -->
            <div class="flex-fill">
              <div class="d-flex align-center mb-2">
                <h3 class="text-h6">{{ property.title }}</h3>
                <v-chip :color="getStatusColor(property.status)" size="small" class="ml-2">
                  {{ 
                    property.status === 'active' ? '租赁中' : 
                    property.status === 'expired' ? '已到期' : '即将入住'
                  }}
                </v-chip>
              </div>
              
              <div class="text-body-1 mb-2">
                <v-icon small class="mr-1">mdi-map-marker</v-icon>
                {{ property.region || '未知区域' }}
              </div>

              <!-- 房东信息 -->
              <div class="text-body-1 mb-2">
                <v-icon small class="mr-1">mdi-account</v-icon>
                房东: {{ property.landlord_username }}
              </div>
              
              <div class="text-body-1 mb-2">
                <v-icon small class="mr-1">mdi-phone</v-icon>
                房东电话: {{ property.landlordPhone }}
              </div>
              
              <div class="text-body-1 mb-2">
                <v-icon small class="mr-1">mdi-home</v-icon>
                用途: {{ property.purpose }}
              </div>
              
              <div class="text-body-1 mb-2">
                <v-icon small class="mr-1">mdi-cash</v-icon>
                租金: {{ property.rentValue }} 元/月
              </div>
              
              <div class="d-flex align-center mb-2">
                <div class="mr-4">
                  <span class="text-caption">起租:</span> {{ property.startDate }}
                </div>
                <div>
                  <span class="text-caption">到期:</span> {{ property.endDate }}
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="d-flex flex-column">
              <!-- 查看合同按钮 -->
                <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                    icon="mdi-file-document-edit-outline"
                    title="查看合同"
                    @click="showContractDialog = true"
                ></v-btn>

                <!-- 合同对话框 -->
                <v-dialog v-model="showContractDialog" max-width="1200" scrollable>
                    <contract :property="property" @close="showContractDialog = false" />
                </v-dialog>
              <v-btn
                size="small"
                color="error"
                variant="text"
                icon="mdi-delete-outline"
                title="退租申请"
                class="mt-2"
              ></v-btn>
              <!-- 申报维修按钮 -->
              <v-btn
                size="small"
                color="warning"
                variant="text"
                icon="mdi-tools"
                title="申报维修"
                class="mt-2"
                @click="openFixCard(property, 'repair')"
              ></v-btn>
              <!-- 投诉按钮 -->
              <v-btn
                size="small"
                color="error"
                variant="text"
                icon="mdi-alert-circle-outline"
                title="投诉"
                class="mt-2"
                @click="openFixCard(property, 'complain')"
              ></v-btn>
            </div>
          </div>
        </v-card>
      </transition-group>
      
      <!-- 无房源提示 -->
      <v-alert
        v-if="!loading && filteredProperties.length === 0"
        type="info"
        variant="tonal"
        class="ma-3"
      >
        没有找到符合条件的房源
      </v-alert>
    </perfect-scrollbar>
  </v-card>
</template>

<style scoped lang="scss">
.property-list {
  height: calc(100% - 72px);
  padding-bottom: 16px;

  .property-item {
    transition: all 0.3s;

    &:hover {
      transition: all 0.3s;
      background-color: rgba(99, 99, 99, 0.05);
      cursor: pointer;
    }
  }
}
</style>