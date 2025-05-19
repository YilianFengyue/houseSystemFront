<template>
  <div class="p-6">
    <!-- 顶部栏 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">🏠 房源管理</h1>
      <el-button type="primary" @click="openForm()">+ 新增房源</el-button>
    </div>

    <!-- 房源表格 -->
    <el-table :data="properties" style="width: 100%" border stripe>
      <el-table-column prop="house_num" label="房源编号" min-width="60" />
      <el-table-column prop="title" label="标题" min-width="100" />
      <el-table-column prop="community" label="小区" min-width="80" />
      <el-table-column prop="area" label="面积 (㎡)" width="100" />
      <el-table-column prop="direction" label="朝向" width="80" />
      <el-table-column prop="rooms" label="户型" width="120" />
      <el-table-column prop="price" label="租金 (元/月)" width="120">
        <template #default="{ row }">￥{{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="decoration" label="装修" width="80" />
      <el-table-column prop="rent_type" label="租赁方式" width="100" />
      <el-table-column prop="publish_time" label="发布时间" width="120" />
      <el-table-column prop="page_views" label="浏览量" width="100" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" link @click="openForm(scope.row, scope.$index)">编辑</el-button>
          <el-button type="danger" link @click="deleteProperty(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <el-empty v-if="!properties.length" description="暂无房源信息" class="mt-10" />

    <!-- 分步弹窗表单 -->
    <el-dialog
      v-model="showForm"
      :title="editIndex !== null ? '编辑房源' : '新增房源'"
      :width="dialogWidth"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-steps :active="activeStep" finish-status="success" style="margin-bottom: 20px;">
        <el-step title="基本信息"></el-step>
        <el-step title="租赁详情"></el-step>
        <el-step title="上传图片"></el-step>
      </el-steps>

      <el-form ref="formRef" :model="form" label-position="top" class="grid grid-cols-1 gap-4">
        <!-- 第一步：基本信息 -->
        <template v-if="activeStep === 0">
          <el-form-item label="房源编号" prop="house_num" :rules="[{ required: true, message: '请输入房源编号' }]" style="width: 500px;">
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
        </template>

        <!-- 第二步：租赁详情 -->
        <template v-if="activeStep === 1">
          <el-form-item label="户型" prop="rooms" style="width: 500px;">
            <el-input v-model="form.rooms" placeholder="请输入户型" />
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

          <el-form-item label="装修情况" style="width: 500px;">
            <el-input v-model="form.decoration" placeholder="如精装" />
          </el-form-item>

          <el-form-item label="是否近地铁" style="width: 500px;">
            <el-switch v-model="form.subway" :active-value="1" :inactive-value="0" />
          </el-form-item>

          <el-form-item label="是否随时看房" style="width: 500px;">
            <el-switch v-model="form.available" :active-value="1" :inactive-value="0" />
          </el-form-item>

          <el-form-item label="是否新上" style="width: 500px;">
            <el-switch v-model="form.tag_new" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </template>

        <!-- 第三步：上传图片及其他 -->
        <template v-if="activeStep === 2">
          <el-form-item label="房东" style="width: 500px;">
            <el-input v-model="form.landlord" placeholder="请输入房东姓名" />
          </el-form-item>

          <el-form-item label="房东电话" style="width: 500px;">
            <el-input v-model="form.phone_num" placeholder="请输入电话号码" />
          </el-form-item>

          <el-form-item label="发布时间" prop="publish_time" :rules="[{ required: true, message: '请输入发布时间' }]" style="width: 500px;">
            <el-date-picker
              v-model="form.publish_time"
              type="date"
              placeholder="请选择发布时间"
              style="width: 100%;"
            />
          </el-form-item>

          <el-form-item label="浏览量" prop="page_views" style="width: 500px;">
            <el-input v-model="form.page_views" placeholder="请输入浏览量" />
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
        </template>
      </el-form>

      <template #footer>
        <el-button v-if="activeStep > 0" @click="activeStep--">上一步</el-button>
        <el-button v-if="activeStep < 2" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="activeStep === 2" type="primary" @click="saveProperty">保存</el-button>
        <el-button @click="closeForm">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const properties = ref([])
onMounted(async () => {
  try {
    const res = await fetch('/api/properties') // 假设这里是获取房源列表的接口
    if (!res.ok) throw new Error('获取房源失败')
    const Data = await res.json()
    properties.value = Data // 赋值给响应式数组
  } catch (error) {
    ElMessage.error('加载房源数据失败')
  }
})

const showForm = ref(false)
const editIndex = ref(null)
const activeStep = ref(0)

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
  publish_time: null,
  page_views: ''
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
    Object.assign(form.value, JSON.parse(JSON.stringify(property)))
    if (!form.value.photos) form.value.photos = []
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
      landlord: '',
      phone_num: '',
      photos: [],
      publish_time: null,
      page_views: ''
    })
    editIndex.value = null
  }
  activeStep.value = 0
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

function nextStep() {
  if (activeStep.value === 0) {
    if (!form.value.house_num || !form.value.title || !form.value.region || !form.value.block || !form.value.community || form.value.area === null) {
      ElMessage.error('请填写完整基本信息')
      return
    }
  } else if (activeStep.value === 1) {
    if (!form.value.price || !form.value.rent_type) {
      ElMessage.error('请填写完整租赁详情')
      return
    }
  }
  activeStep.value++
}

function saveProperty() {
  // 简单校验示例
  if (!form.value.publish_time) {
    ElMessage.error('请选择发布时间')
    return
  }
  // 保存逻辑（本地模拟）
  if (editIndex.value !== null) {
    properties.value[editIndex.value] = JSON.parse(JSON.stringify(form.value))
    ElMessage.success('编辑成功')
  } else {
    properties.value.push(JSON.parse(JSON.stringify(form.value)))
    ElMessage.success('新增成功')
  }
  closeForm()
}

function deleteProperty(index) {
  ElMessageBox.confirm('确认删除此房源？', '提示', {
    type: 'warning',
  }).then(() => {
    properties.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
/* 让弹窗表单更窄更美观 */
.el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}

/* 让上传图片宽度自适应 */
.el-upload {
  width: 100%;
}
</style>
