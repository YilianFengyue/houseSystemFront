<template>
  <div class="p-6">
    <!-- 顶部栏 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">🏠 房源管理</h1>
      <el-button type="primary" @click="openForm()">+ 新增房源</el-button>
    </div>

    <!-- 房源表格 -->
    <el-table :data="properties" style="width: 100%" border stripe>
      <el-table-column prop="title" label="房源编号" min-width="40" />
  <el-table-column prop="title" label="标题" min-width="120" />
  <el-table-column prop="community" label="小区" min-width="120" />
  <el-table-column prop="area" label="面积 (㎡)" width="100" />
  <el-table-column prop="direction" label="朝向" width="80" />
  <el-table-column prop="rooms" label="户型" width="120" />
  <el-table-column prop="price" label="租金 (元/月)" width="120">
    <template #default="{ row }">￥{{ row.price }}</template>
  </el-table-column>
  <el-table-column prop="decoration" label="装修" width="80" />
  <el-table-column prop="rent_type" label="租赁方式" width="100" />
  <el-table-column label="操作" width="160">
    <template #default="scope">
      <el-button type="primary" link @click="openForm(scope.row, scope.$index)">编辑</el-button>
      <el-button type="danger" link @click="deleteProperty(scope.$index)">删除</el-button>
    </template>
  </el-table-column>
</el-table>


    <!-- 空状态 -->
    <el-empty v-if="!properties.length" description="暂无房源信息" class="mt-10" />

    <!-- 弹窗表单 -->
    <el-dialog
      v-model="showForm"
      :title="editIndex !== null ? '编辑房源' : '新增房源'"
      :width="dialogWidth"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" label-position="top" class="grid grid-cols-1 gap-4">
        <el-form-item label="房源编号" prop="title" :rules="[{ required: true, message: '请输入房源编号' }]" style="width: 500px;">
  <el-input v-model="form.house_num" placeholder="请输入房源编号" />
</el-form-item>

<el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请输入标题' }]" style="width: 500px;">
  <el-input v-model="form.title" placeholder="请输入标题" />
</el-form-item>

<el-form-item label="区" prop="region" :rules="[{ required: true, message: '请输入所在区' }]" style="width: 500px;">
  <el-input v-model="form.region" placeholder="请输入所在区" />
</el-form-item>

<el-form-item label="街道" prop="block" :rules="[{ required: true, message: '请输入街道' }]" style="width: 500px;">
  <el-input v-model="form.block" placeholder="请输入街道" />
</el-form-item>

<el-form-item label="小区" prop="community" :rules="[{ required: true, message: '请输入小区名' }]" style="width: 500px;">
  <el-input v-model="form.community" placeholder="请输入小区名" />
</el-form-item>

<el-form-item label="面积（㎡）" prop="area" :rules="[{ required: true, message: '请输入面积' }]" style="width: 500px;">
  <el-input-number v-model="form.area" :min="0" :step="1" :controls="false" class="w-full" />
</el-form-item>

<el-form-item label="价格（元/月）" prop="price" :rules="[{ required: true, message: '请输入价格' }]" style="width: 500px;">
  <el-input-number v-model="form.price" :min="0" :step="1" :controls="false" class="w-full" />
</el-form-item>

<el-form-item label="租赁方式" prop="rent_type" :rules="[{ required: true, message: '请选择租赁方式' }]" style="width: 500px;">
  <el-select v-model="form.rent_type" placeholder="请选择租赁方式">
    <el-option label="整租" value="整租" />
    <el-option label="合租" value="合租" />
  </el-select>
</el-form-item>

  <el-form-item label="装修情况">
    <el-input v-model="form.decoration" placeholder="如精装" style="--el-input-width: 500px" />
  </el-form-item>
  <el-form-item label="是否近地铁">
    <el-switch v-model="form.subway" :active-value="1" :inactive-value="0" />
  </el-form-item>
  <el-form-item label="是否随时看房">
    <el-switch v-model="form.available" :active-value="1" :inactive-value="0" />
  </el-form-item>
  <el-form-item label="是否新上">
    <el-switch v-model="form.tag_new" :active-value="1" :inactive-value="0" />
  </el-form-item>
  <el-form-item label="房东">
    <el-input v-model="form.landlord" placeholder="请输入房东姓名" style="--el-input-width: 500px" />
  </el-form-item>
  <el-form-item label="房东电话">
    <el-input v-model="form.phone_num" placeholder="请输入电话号码" style="--el-input-width: 500px" />
  </el-form-item>
        <el-form-item label="房源图片">
        <el-upload
          v-model:file-list="form.photos"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          accept="image/*"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <img :src="file.url" class="w-full h-full object-cover" />
          </template>
        </el-upload>
        </el-form-item>
        <el-form-item label="房源视频">
          <el-upload
            v-model:file-list="form.videos"
            action="#"
            list-type="text"
            :auto-upload="false"
            accept="video/*"
          >
            <el-button>选择视频</el-button>
          </el-upload>
        </el-form-item>
      </el-form>



      <template #footer>
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="saveProperty">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const properties = ref([])
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/houseinfo')  // 假设这里是获取房源列表的接口
    if (!res.ok) throw new Error('获取房源失败')
    const data = await res.json()
    properties.value = Array.isArray(data.data.items) ? data.data.items : []  // 赋值给响应式数组
  } catch (error) {
    ElMessage.error('加载房源数据失败')
  }
})
const showForm = ref(false)
const editIndex = ref(null)

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
  videos: []
})

const dialogWidth = computed(() => {
  if (window.innerWidth > 1024) {
    return '600px'
  } else if (window.innerWidth > 768) {
    return '500px'
  } else {
    return '95%'
  }
})

function openForm(property = null, index = null) {
  if (property) {
    // 复制其他字段
    Object.assign(form.value, property)
    // 把原有图片数组转换成上传组件能识别的格式
    form.value.photos = (property.photos || []).map((url, i) => ({
      name: `图片${i + 1}`,
      url,
      status: 'done',
      uid: `edit-${i}-${Date.now()}`
    }))
    // 视频同理，如果用到视频上传也要转换
    form.value.videos = (property.videos || []).map((url, i) => ({
      name: `视频${i + 1}`,
      url,
      status: 'done',
      uid: `edit-video-${i}-${Date.now()}`
    }))
    editIndex.value = index
  } else {
    Object.assign(form.value, {
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
      photos: [],
      videos: [],
      landlord: '',
      phone_num: ''
    })
    editIndex.value = null
  }
  showForm.value = true
}



function closeForm() {
  showForm.value = false
}
const formRef = ref(null)

async function saveProperty() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()  // 校验失败会抛异常，直接跳转catch

    // 构造formData
    const formData = new FormData()
    for (const key in form.value) {
      if (key === 'photos' || key === 'videos') {
        form.value[key].forEach(f => {
          if (f.raw) formData.append(key + '[]', f.raw)
        })
      } else {
        formData.append(key, form.value[key] ?? '')
      }
    }

    const url = editIndex.value !== null ? `http://localhost:5000/houseinfo/${form.value.house_num || ''}` : 'http://localhost:5000/houseinfo'
    const method = editIndex.value !== null ? 'PUT' : 'POST'

    const res = await fetch(url, { method, body: formData })
    //if (!res.ok) {
     // const errMsg = await res.text()
     // throw new Error(`请求失败: ${errMsg}`)
   // }

    if (editIndex.value !== null) {
      properties.value[editIndex.value] = { ...form.value }
      ElMessage.success('房源更新成功')
    } else {
      properties.value.push({ ...form.value })
      ElMessage.success('房源添加成功')
    }

    closeForm()
  } catch (err) {
    // 如果是校验失败，会是一个对象，err.errors数组里有详细信息，可以定制提示
    if (err.errors && err.errors.length > 0) {
      ElMessage.error(err.errors[0].message || '请填写所有必填项')
    } else {
      ElMessage.error(err.message || '请填写所有必填项或保存失败')
    }
  }
}

function deleteProperty(index) {
  ElMessageBox.confirm('确认删除该房源？', '提示', {
    type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消'
  }).then(() => {
    properties.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}



</script>
