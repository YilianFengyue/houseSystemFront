<template>
  <v-card flat class="amenities-vuetify-card">
    <v-card-title class="text-subtitle-1 font-weight-medium text-blue-grey-darken-1 px-4 pt-3 pb-1">
      配套设施
    </v-card-title>
    <v-card-text class="px-4 pb-3 pt-2">
      <div v-if="availableAmenities.length > 0" class="d-flex flex-wrap" style="gap: 16px;">
        <div
          v-for="amenity in availableAmenities"
          :key="amenity.key"
          class="d-flex flex-column align-center text-center pa-1"
          style="width: 75px;" >
          <Icon :icon="amenity.icon" style="font-size: 28px;" class="text-grey-darken-1 mb-1" />
          <span class="text-caption text-grey-darken-2">{{ amenity.label }}</span>
        </div>
      </div>
      <div v-else class="text-center text-caption text-grey-darken-1 py-3">
        暂无设施信息
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"; 
import { ref, computed } from 'vue';
import type { PropType, ComputedRef } from 'vue'; // 引入 Vue 的类型工具

// 定义设施信息的接口，增强类型检查
interface AmenityInfo {
  key: string;
  label: string;
  icon: string;
}

// 定义 facilities prop 的类型
interface Facilities {
  [key: string]: boolean; // 假设 facilities 是一个键为字符串，值为布尔的对象
}

// 定义 props
const props = defineProps({
  facilities: {
    type: Object as PropType<Facilities>, // 使用 PropType 进行更精确的类型定义
    required: true,
    default: () => ({}) // 默认值为空对象
  }
});

// 预定义的设施列表及其元数据 (key 已全部转为小写)
const allAmenities = ref<AmenityInfo[]>([
  { key: 'washer', label: '洗衣机', icon: 'material-symbols:local-laundry-service-outline-sharp' },
  { key: 'airconditioner', label: '空调', icon: 'material-symbols:ac-unit-outline' },
  { key: 'wardrobe', label: '衣柜', icon: 'material-symbols:dresser-outline' },
  { key: 'tv', label: '电视', icon: 'material-symbols:tv-outline-rounded' },
  { key: 'refrigerator', label: '冰箱', icon: 'material-symbols:kitchen-outline-rounded' },
  { key: 'waterheater', label: '热水器', icon: 'material-symbols:water-heater-outline' },
  { key: 'bed', label: '床', icon: 'material-symbols:bed-outline' },
  { key: 'heating', label: '暖气', icon: 'material-symbols:radiator-outline' },
  { key: 'wifi', label: '宽带', icon: 'material-symbols:wifi-rounded' },
  { key: 'naturalgas', label: '天然气', icon: 'material-symbols:outdoor-grill-outline' }
]);

// 计算出当前房源可用的设施列表
const availableAmenities: ComputedRef<AmenityInfo[]> = computed(() => {
  // 确保 props.facilities 存在且不为空对象
  if (!props.facilities || Object.keys(props.facilities).length === 0) {
    return [];
  }
  return allAmenities.value.filter(amenity => props.facilities[amenity.key] === true);
});
</script>