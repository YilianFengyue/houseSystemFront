<template>
  <div class="p-6">

    <!-- 顶部栏 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">🏠 房源管理</h1>
      <el-button type="primary" @click="openForm()">+ 新增房源</el-button>
    </div>

    <!-- 房源表格 -->
    <el-table :data="properties" style="width: 100%" border stripe>
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="area" label="面积 (㎡)" width="100" />
      <el-table-column prop="rent" label="租金 (元/月)" width="120">
        <template #default="{ row }">￥{{ row.rent }}</template>
      </el-table-column>
      <el-table-column prop="deposit" label="押金 (元)" width="100">
        <template #default="{ row }">￥{{ row.deposit }}</template>
      </el-table-column>
      <el-table-column prop="decoration" label="装修" />
      <el-table-column prop="status" label="状态" width="120" />
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
      <el-form :model="form" label-position="top" class="grid gap-4">
        <el-form-item label="地址">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>

        <el-form-item label="类型">
          <el-input v-model="form.type" placeholder="如一居、二居等" />
        </el-form-item>

        <el-form-item label="面积（㎡）">
          <el-input-number v-model="form.area" :min="0" :step="1" :controls="false" class="w-full" />
        </el-form-item>

        <el-form-item label="租金（元/月）">
          <el-input-number v-model="form.rent" :min="0" :step="1" :controls="false" class="w-full" />
        </el-form-item>

        <el-form-item label="押金（元）">
          <el-input-number v-model="form.deposit" :min="0" :step="1" :controls="false" class="w-full" />
        </el-form-item>

        <el-form-item label="装修">
          <el-input v-model="form.decoration" placeholder="如精装、简装等" />
        </el-form-item>

        <el-form-item label="房源状态">
          <el-select v-model="form.status" placeholder="请选择状态" class="w-full">
            <el-option label="空置" value="空置" />
            <el-option label="出租中" value="出租中" />
            <el-option label="维修中" value="维修中" />
          </el-select>
        </el-form-item>

        <el-form-item label="房屋照片">
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

        <el-form-item label="房屋视频">
          <el-upload
            v-model:file-list="form.videos"
            action="#"
            :limit="1"
            :auto-upload="false"
            accept="video/*"
          >
            <el-button type="primary">上传视频</el-button>
            <template #tip>
              <div class="el-upload__tip">仅支持一个视频，格式如 mp4</div>
            </template>
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const properties = ref([]) // 房源列表
const showForm = ref(false) // 控制弹窗显示
const editIndex = ref(null) // 当前编辑索引

const form = ref({
  address: '',
  type: '',
  area: null,
  rent: null,
  deposit: null,
  decoration: '',
  status: '',      // 新增房源状态字段
  photos: [],      // 房屋照片列表
  videos: []       // 房屋视频列表
})

// 弹窗宽度响应式
const dialogWidth = computed(() => {
  if (window.innerWidth > 1024) {
    return '700px'
  } else if (window.innerWidth > 768) {
    return '600px'
  } else {
    return '90%'
  }
})

// 打开表单
function openForm(property = null, index = null) {
  if (property) {
    form.value = {
      address: property.address || '',
      type: property.type || '',
      area: property.area || null,
      rent: property.rent || null,
      deposit: property.deposit || null,
      decoration: property.decoration || '',
      status: property.status || '',
      photos: property.photos ? [...property.photos] : [],
      videos: property.videos ? [...property.videos] : []
    }
    editIndex.value = index
  } else {
    form.value = {
      address: '',
      type: '',
      area: null,
      rent: null,
      deposit: null,
      decoration: '',
      status: '',
      photos: [],
      videos: []
    }
    editIndex.value = null
  }
  showForm.value = true
}

// 保存房源（包含文件和所有字段）
async function saveProperty() {
  if (!form.value.address || !form.value.type) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    // 构造FormData上传所有字段和文件
    const formData = new FormData()
    formData.append('address', form.value.address)
    formData.append('type', form.value.type)
    formData.append('area', form.value.area ?? '')
    formData.append('rent', form.value.rent ?? '')
    formData.append('deposit', form.value.deposit ?? '')
    formData.append('decoration', form.value.decoration)
    formData.append('status', form.value.status)

    // 上传照片文件
    form.value.photos.forEach((fileItem, index) => {
      if (fileItem.raw) {
        formData.append('photos', fileItem.raw)
      }
    })

    // 上传视频文件（最多一个）
    form.value.videos.forEach((fileItem) => {
      if (fileItem.raw) {
        formData.append('videos', fileItem.raw)
      }
    })

    // 这里用fetch做示范，替换成你的后端接口地址
    const response = await fetch('/api/properties', {
      method: editIndex.value !== null ? 'PUT' : 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const savedData = await response.json()

    // 本地更新列表
    if (editIndex.value !== null) {
      properties.value[editIndex.value] = savedData
      ElMessage.success('房源更新成功')
    } else {
      properties.value.push(savedData)
      ElMessage.success('房源添加成功')
    }

    closeForm()
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  }
}

// 关闭表单
function closeForm() {
  showForm.value = false
}

// 删除房源
function deleteProperty(index) {
  ElMessageBox.confirm('确认删除该房源？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      properties.value.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

