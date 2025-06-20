<template>
  <v-card height="100%" class="pa-4">
    <!-- 顶部栏 -->
    <v-card-title class="d-flex align-center">
      <span class="text-h5">🏠 房源管理</span>
      <v-spacer></v-spacer>
      <v-text-field
        clearable
        variant="solo"
        class="elevation-1"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="搜索房源/小区/房东"
        v-model="searchKey"
        style="max-width: 300px; margin-right: 16px;"
      ></v-text-field>
      <v-btn color="primary" @click="openForm()">
        <v-icon start>mdi-plus</v-icon>
        新增房源
      </v-btn>
    </v-card-title>

    <!-- 房源表格 -->
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredProperties"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.price="{ item }">
          ￥{{ item.price }}
        </template>
        <template v-slot:item.isRant="{ item }">
          <v-chip
            :color="item.isRant ? 'green' : 'orange'"
            variant="tonal"
            size="small"
            class="ma-2"
          >
            <v-icon start>
              {{ item.isRant ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>
            {{ item.isRant ? '已出租' : '未出租' }}
          </v-chip>
        </template>
        <template v-slot:item.image_url="{ item }">
          <v-img
            :src="item.image_url"
            max-width="100"
            max-height="60"
            contain
          ></v-img>
        </template>
      </v-data-table>

      <!-- 空状态 -->
      <v-alert
        v-if="!properties.length && !loading"
        type="info"
        variant="tonal"
        class="ma-3"
      >
        暂无房源信息
      </v-alert>
    </v-card-text>

    <!-- 弹窗表单 -->
    <v-dialog v-model="showForm" max-width="800" scrollable>
      <v-card>
        <v-card-title>
          {{ editIndex !== null ? '编辑房源' : '新增房源' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" class="grid grid-cols-1 gap-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.house_num"
                  label="房源编号"
                  :rules="[v => !!v || '请输入房源编号']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.title"
                  label="标题"
                  :rules="[v => !!v || '请输入标题']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.region"
                  label="区"
                  :rules="[v => !!v || '请输入所在区']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.block"
                  label="街道"
                  :rules="[v => !!v || '请输入街道']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.community"
                  label="小区"
                  :rules="[v => !!v || '请输入小区名']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.area"
                  label="面积（㎡）"
                  type="number"
                  :rules="[v => !!v || '请输入面积']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.price"
                  label="价格（元/月）"
                  type="number"
                  :rules="[v => !!v || '请输入价格']"
                  required
                  prefix="￥"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.rent_type"
                  label="租赁方式"
                  :items="['整租', '合租']"
                  :rules="[v => !!v || '请选择租赁方式']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.decoration"
                  label="装修情况"
                  placeholder="如精装"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-switch
                  v-model="form.subway"
                  :label="`是否近地铁: ${form.subway ? '是' : '否'}`"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="4">
                <v-switch
                  v-model="form.available"
                  :label="`是否随时看房: ${form.available ? '是' : '否'}`"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="4">
                <v-switch
                  v-model="form.tag_new"
                  :label="`是否新上: ${form.tag_new ? '是' : '否'}`"
                  color="primary"
                ></v-switch>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.landlord"
                  label="房东"
                  placeholder="请输入房东姓名"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone_num"
                  label="房东电话"
                  placeholder="请输入电话号码"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-file-input
                  v-model="form.photos"
                  label="房源图片"
                  multiple
                  prepend-icon="mdi-camera"
                  accept="image/*"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeForm">取消</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveProperty">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from "@/stores/profileStore";
const profileStore = useProfileStore();
const username = profileStore.user.name;

const searchKey = ref("");
const loading = ref(false);
const properties = ref([]);
const showForm = ref(false);
const editIndex = ref(null);
const formRef = ref(null);

const form = ref({
  house_num: '',
  title: '',
  region: '',
  block: '',
  community: '',
  area: null,
  direction: '',
  rooms: '',
  price: null,
  rent_type: '',
  decoration: '',
  subway: 0,
  available: 1,
  tag_new: 0,
  landlord: '',
  phone_num: '',
  photos: [],
  isRant: false
});

const headers = [
  { title: '房源图片', key: 'image_url', width: '120px' },
  { title: '房源编号', key: 'house_num', width: '120px' },
  { title: '标题', key: 'title' },
  { title: '小区', key: 'community' },
  { title: '面积 (㎡)', key: 'area', width: '100px' },
  { title: '朝向', key: 'direction', width: '80px' },
  { title: '户型', key: 'rooms', width: '120px' },
  { title: '租金 (元/月)', key: 'price', width: '120px' },
  { title: '装修', key: 'decoration', width: '80px' },
  { title: '租赁方式', key: 'rent_type', width: '100px' },
  { title: '出租状态', key: 'isRant', width: '120px', align: 'center' }
];

const filteredProperties = computed(() => {
  if (!searchKey.value) return properties.value;
  const keyword = searchKey.value.toLowerCase();
  return properties.value.filter(property => 
    (property.house_num && property.house_num.toLowerCase().includes(keyword)) ||
    (property.title && property.title.toLowerCase().includes(keyword)) ||
    (property.community && property.community.toLowerCase().includes(keyword)) ||
    (property.landlord && property.landlord.toLowerCase().includes(keyword)) ||
    (property.phone_num && property.phone_num.includes(keyword))
  );
});

onMounted(async () => {
  try {
    loading.value = true;
    console.log("传递给后端的username：" + username);
    
    const requestBody = { username: username };
    const res = await fetch('http://localhost:5000/houseinfo/landlord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!res.ok) throw new Error(await res.text() || '获取房源失败');
    
    const data = await res.json();
    properties.value = Array.isArray(data.data) ? data.data : [];
    console.log("获取到的房源数据：", properties.value);
    
  } catch (error) {
    console.error('加载房源数据失败:', error);
  } finally {
    loading.value = false;
  }
});

function openForm(property = null, index = null) {
  if (property) {
    form.value = { ...property };
    editIndex.value = index;
  } else {
    form.value = {
      house_num: '',
      title: '',
      region: '',
      block: '',
      community: '',
      area: null,
      direction: '',
      rooms: '',
      price: null,
      rent_type: '',
      decoration: '',
      subway: 0,
      available: 1,
      tag_new: 0,
      landlord: '',
      phone_num: '',
      photos: [],
      isRant: false
    };
    editIndex.value = null;
  }
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

async function saveProperty() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    const formData = new FormData();
    Object.entries(form.value).forEach(([key, value]) => {
      if (key === 'photos') {
        value.forEach(file => formData.append(key, file));
      } else {
        formData.append(key, value ?? '');
      }
    });

    const url = editIndex.value !== null 
      ? `http://localhost:5000/houseinfo/${form.value.house_num || ''}` 
      : 'http://localhost:5000/houseinfo';
    const method = editIndex.value !== null ? 'PUT' : 'POST';

    const res = await fetch(url, { method, body: formData });
    if (!res.ok) throw new Error(await res.text() || '保存失败');

    if (editIndex.value !== null) {
      properties.value[editIndex.value] = { ...form.value };
    } else {
      const newProperty = await res.json();
      properties.value.push(newProperty.data);
    }

    closeForm();
  } catch (error) {
    console.error('保存房源失败:', error);
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-btn {
  text-transform: none;
}

.v-chip {
  cursor: default;
  transition: none;
}
/* 移除悬停效果 */
</style>