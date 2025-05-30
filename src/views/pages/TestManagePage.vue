<!--
* @Component: HouseManagement
* @Maintainer: Admin
* @Description: 房屋租赁系统房源管理界面（管理员审核）
-->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import moment from 'moment'

interface HouseInfo {
  id: number
  title: string
  community: string
  region: string
  block: string
  rooms: string
  area: number
  price: number
  rent_type: string
  decoration: string
  direction: string
  subway: number
  available: number
  tag_new: number
  landlord: string
  phone_num: string
  publish_time: string
  page_views: string
  image_url: string
  house_num: string
}

interface HouseDetail {
  detail_id: number
  house_info_id: number
  facilities: Record<string, boolean>
  photos: string[]
  map_coordinates: any
  created_at: string
  updated_at: string
}

const loading = ref(true)
const totalRows = ref(0)
const selectedHouse = ref<HouseInfo | null>(null)
const houseDetail = ref<HouseDetail | null>(null)
const detailDialog = ref(false)
const confirmDialog = ref(false)
const actionType = ref<'delete' | 'toggle'>('delete')
const targetHouse = ref<HouseInfo | null>(null)

const queryOptions = reactive({
  query: '',
  region: '',
  rent_type: '',
  available: '',
  page: 1,
  per_page: 10,
})

const headers = [
  { title: '房源ID', key: 'id', width: '80px' },
  { title: '标题', key: 'title', width: '300px' },
  { title: '社区', key: 'community', width: '120px' },
  { title: '区域', key: 'region', width: '100px' },
  { title: '户型', key: 'rooms', width: '100px' },
  { title: '面积', key: 'area', width: '80px' },
  { title: '价格', key: 'price', width: '100px' },
  { title: '租赁方式', key: 'rent_type', width: '100px' },
  { title: '状态', key: 'available', width: '100px' },
  { title: '房东', key: 'landlord', width: '100px' },
  { title: '发布时间', key: 'publish_time', width: '120px' },
  { title: '操作', key: 'actions', width: '200px' },
]

const houseList = ref<HouseInfo[]>([])

// 获取房源列表
const getHouseList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryOptions,
      community: queryOptions.query, // 将搜索框内容作为社区搜索
    }
    
    // 清空空值参数
    Object.keys(params).forEach(key => {
      if (!params[key] && params[key] !== 0) {
        delete params[key]
      }
    })

    const response = await axios.get('http://localhost:5000/houseinfo/', { params })
    
    houseList.value = response.data.data.items || []
    totalRows.value = response.data.data.total || 0
  } catch (error) {
    console.error('获取房源列表失败:', error)
    // 这里可以添加错误提示
  } finally {
    loading.value = false
  }
}

// 获取房源详情
const getHouseDetail = async (houseId: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/housedetail/${houseId}`)
    houseDetail.value = response.data.data
  } catch (error) {
    console.error('获取房源详情失败:', error)
    houseDetail.value = null
  }
}

// 查看详情
const viewDetail = async (house: HouseInfo) => {
  selectedHouse.value = house
  await getHouseDetail(house.id)
  detailDialog.value = true
}

// 切换房源状态（上架/下架）
const toggleHouseStatus = async (house: HouseInfo) => {
  try {
    const newStatus = house.available === 1 ? 0 : 1
    await axios.put(`http://localhost:5000/houseinfo/${house.id}`, {
      available: newStatus
    })
    
    // 更新本地数据
    house.available = newStatus
    
    // 这里可以添加成功提示
    console.log(`房源${newStatus === 1 ? '上架' : '下架'}成功`)
  } catch (error) {
    console.error('更新房源状态失败:', error)
    // 这里可以添加错误提示
  }
}

// 删除房源
const deleteHouse = async (house: HouseInfo) => {
  try {
    await axios.delete(`http://localhost:5000/houseinfo/${house.id}`)
    
    // 从列表中移除
    const index = houseList.value.findIndex(h => h.id === house.id)
    if (index > -1) {
      houseList.value.splice(index, 1)
      totalRows.value--
    }
    
    console.log('房源删除成功')
  } catch (error) {
    console.error('删除房源失败:', error)
    // 这里可以添加错误提示
  }
}

// 确认操作
const confirmAction = (house: HouseInfo, type: 'delete' | 'toggle') => {
  targetHouse.value = house
  actionType.value = type
  confirmDialog.value = true
}

// 执行确认的操作
const executeAction = async () => {
  if (!targetHouse.value) return
  
  if (actionType.value === 'delete') {
    await deleteHouse(targetHouse.value)
  } else if (actionType.value === 'toggle') {
    await toggleHouseStatus(targetHouse.value)
  }
  
  confirmDialog.value = false
  targetHouse.value = null
}

// 分页更新
const onUpdateOptions = async (options: any) => {
  queryOptions.per_page = options.itemsPerPage
  queryOptions.page = options.page
  await getHouseList()
}

// 搜索
const onSearch = async () => {
  queryOptions.page = 1
  await getHouseList()
}

// 清空搜索
const clearSearch = () => {
  queryOptions.query = ''
  queryOptions.region = ''
  queryOptions.rent_type = ''
  queryOptions.available = ''
  onSearch()
}

// 格式化价格
const formatPrice = (price: number) => {
  return `¥${price}/月`
}

// 格式化面积
const formatArea = (area: number) => {
  return `${area}㎡`
}

// 获取状态颜色
const getStatusColor = (available: number) => {
  return available === 1 ? 'success' : 'warning'
}

// 获取状态文本
const getStatusText = (available: number) => {
  return available === 1 ? '已上架' : '已下架'
}

// 预览图片
const imgOverlay = ref(false)
const imgSrc = ref('')
const previewImg = (url: string) => {
  imgSrc.value = url
  imgOverlay.value = true
}

onMounted(() => {
  getHouseList()
})
</script>

<template>
  <div class="pa-5">
    <v-card>
      <v-card-title class="font-weight-bold">
        <span>房源管理系统</span>
        <v-spacer></v-spacer>
        
        <!-- 搜索和筛选区域 -->
        <div class="d-flex gap-3 align-center">
          <v-select
            v-model="queryOptions.available"
            :items="[
              { title: '全部状态', value: '' },
              { title: '已上架', value: '1' },
              { title: '已下架', value: '0' }
            ]"
            variant="outlined"
            density="compact"
            style="width: 150px;"
            hide-details
          ></v-select>
          
          <v-select
            v-model="queryOptions.rent_type"
            :items="[
              { title: '全部类型', value: '' },
              { title: '整租', value: '整租' },
              { title: '合租', value: '合租' }
            ]"
            variant="outlined"
            density="compact"
            style="width: 150px;"
            hide-details
          ></v-select>
          
          <v-text-field
            v-model="queryOptions.region"
            variant="outlined"
            placeholder="区域"
            density="compact"
            style="width: 120px;"
            hide-details
            clearable
          ></v-text-field>
          
          <v-text-field
            v-model="queryOptions.query"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            placeholder="搜索社区名称"
            single-line
            hide-details
            clearable
            density="compact"
            style="width: 250px;"
            @keyup.enter="onSearch"
          ></v-text-field>
          
          <v-btn
            color="primary"
            @click="onSearch"
            prepend-icon="mdi-magnify"
          >
            搜索
          </v-btn>
          
          <v-btn
            variant="outlined"
            @click="clearSearch"
            prepend-icon="mdi-refresh"
          >
            重置
          </v-btn>
        </div>
      </v-card-title>
      
      <v-divider />
      
      <div>
        <v-data-table-server
          :headers="headers"
          :items="houseList"
          :loading="loading"
          :items-per-page="queryOptions.per_page"
          :items-length="totalRows"
          item-value="id"
          @update:options="onUpdateOptions"
          fixed-header
          height="900"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center"># {{ item.id }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-img
                    :src="item.image_url"
                    height="60"
                    width="80"
                    cover
                    class="rounded mr-3 v-card--link"
                    @click="previewImg(item.image_url)"
                  />
                  <div>
                    <div class="font-weight-bold text-truncate" style="max-width: 200px;">
                      {{ item.title }}
                    </div>
                    <div class="text-caption text-grey">
                      房源号: {{ item.house_num }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="font-weight-medium">{{ item.community }}</td>
              <td>{{ item.region }}</td>
              <td>
                <v-chip size="small" variant="outlined">
                  {{ item.rooms }}
                </v-chip>
              </td>
              <td>{{ formatArea(item.area) }}</td>
              <td class="font-weight-bold text-red">{{ formatPrice(item.price) }}</td>
              <td>
                <v-chip
                  :color="item.rent_type === '整租' ? 'primary' : 'secondary'"
                  size="small"
                >
                  {{ item.rent_type }}
                </v-chip>
              </td>
              <td>
                <v-chip
                  :color="getStatusColor(item.available)"
                  size="small"
                >
                  {{ getStatusText(item.available) }}
                </v-chip>
              </td>
              <td>
                <div>
                  <div class="font-weight-medium">{{ item.landlord }}</div>
                  <div class="text-caption text-grey">{{ item.phone_num }}</div>
                </div>
              </td>
              <td>{{ moment(item.publish_time).format('YYYY/MM/DD') }}</td>
              <td>
                <div class="d-flex gap-1">
                  <v-btn
                    size="small"
                    color="info"
                    variant="outlined"
                    @click="viewDetail(item)"
                  >
                    详情
                  </v-btn>
                  <v-btn
                    size="small"
                    :color="item.available === 1 ? 'warning' : 'success'"
                    variant="outlined"
                    @click="confirmAction(item, 'toggle')"
                  >
                    {{ item.available === 1 ? '下架' : '上架' }}
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="outlined"
                    @click="confirmAction(item, 'delete')"
                  >
                    删除
                  </v-btn>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
    </v-card>

    <!-- 房源详情对话框 -->
    <v-dialog v-model="detailDialog" max-width="1200" scrollable>
      <v-card v-if="selectedHouse">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">房源详情</span>
          <v-btn icon="mdi-close" variant="text" @click="detailDialog = false"></v-btn>
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="pa-6">
          <v-row>
            <!-- 基本信息 -->
            <v-col cols="12" md="8">
              <h3 class="mb-3">基本信息</h3>
              <v-row>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">房源标题</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.title }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">社区名称</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.community }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">区域/版块</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.region }} - {{ selectedHouse.block }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">户型</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.rooms }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">面积</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ formatArea(selectedHouse.area) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">价格</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium text-red">{{ formatPrice(selectedHouse.price) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">租赁方式</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.rent_type }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <v-list-item-title class="text-caption text-grey">装修情况</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.decoration }}</v-list-item-subtitle>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-col>
            
            <!-- 房东信息 -->
            <v-col cols="12" md="4">
              <h3 class="mb-3">房东信息</h3>
              <v-card variant="outlined">
                <v-card-text>
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-grey">房东姓名</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.landlord }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-grey">联系电话</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.phone_num }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-grey">发布时间</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ moment(selectedHouse.publish_time).format('YYYY年MM月DD日') }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-title class="text-caption text-grey">浏览次数</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-medium">{{ selectedHouse.page_views }}</v-list-item-subtitle>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- 房源图片 -->
          <div v-if="houseDetail && houseDetail.photos.length > 0" class="mt-6">
            <h3 class="mb-3">房源图片</h3>
            <div class="d-flex flex-wrap gap-3">
              <v-img
                v-for="(photo, index) in houseDetail.photos"
                :key="index"
                :src="photo"
                height="150"
                width="200"
                cover
                class="rounded v-card--link"
                @click="previewImg(photo)"
              />
            </div>
          </div>
          
          <!-- 配套设施 -->
          <div v-if="houseDetail && houseDetail.facilities" class="mt-6">
            <h3 class="mb-3">配套设施</h3>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="(value, key) in houseDetail.facilities"
                :key="key"
                :color="value ? 'success' : 'grey'"
                :variant="value ? 'flat' : 'outlined'"
                size="small"
              >
                <v-icon
                  :icon="value ? 'mdi-check' : 'mdi-close'"
                  start
                />
                {{ key }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 确认操作对话框 -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>
          {{ actionType === 'delete' ? '确认删除' : '确认操作' }}
        </v-card-title>
        <v-card-text>
          <template v-if="actionType === 'delete'">
            确定要删除房源 "{{ targetHouse?.community }}" 吗？此操作不可撤销。
          </template>
          <template v-else>
            确定要{{ targetHouse?.available === 1 ? '下架' : '上架' }}房源 "{{ targetHouse?.community }}" 吗？
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDialog = false">取消</v-btn>
          <v-btn
            :color="actionType === 'delete' ? 'error' : 'primary'"
            @click="executeAction"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 图片预览 -->
    <v-overlay
      v-model="imgOverlay"
      location-strategy="connected"
      scroll-strategy="none"
    >
      <div
        @click="imgOverlay = false"
        class="w-screen h-screen d-flex align-center justify-center"
      >
        <v-img height="80%" :src="imgSrc" />
      </div>
    </v-overlay>
  </div>
</template>

<style scoped lang="scss">
.v-card--link {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>