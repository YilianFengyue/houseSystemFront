<template>
  <v-container fluid class="py-4 px-8">
    <v-card elevation="4" class="pa-4" rounded="xl" color="#fafafa">
      <v-toolbar flat class="mb-4">
        <v-toolbar-title class="text-h6 font-weight-bold text-primary">🏠 房源管理</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="text-white"
          style="background: linear-gradient(to right, #42a5f5, #478ed1)"
          prepend-icon="mdi-plus"
          @click="openForm()"
        >
          新增房源
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="properties"
        item-key="house_num"
        class="elevation-2"
        :items-per-page="8"
        show-select
        hover
        dense
        rounded
        height="calc(100vh - 240px)"
        :footer-props="{
          'items-per-page-options': [8, 16, 32],
          'items-per-page-text': '每页：',
        }"
      >
        <!-- ✅ 暂无数据提示：大图标 + 居中提示 -->
        <template #no-data>
          <v-container
            class="fill-height d-flex flex-column justify-center align-center"
            style="min-height: 300px"
          >
            <v-icon size="64" color="blue">mdi-home-alert</v-icon>
            <div class="text-subtitle-1 text-grey mt-3">暂无房源数据</div>
          </v-container>
        </template>

        <!-- ✅ 图标列 -->
        <template #item.subway="{ item }">
          <v-icon :color="item.subway === 1 ? 'blue' : 'grey'">
            {{ item.subway === 1 ? 'mdi-subway' : 'mdi-subway-off' }}
          </v-icon>
        </template>
        <template #item.available="{ item }">
          <v-icon :color="item.available === 1 ? 'green' : 'grey'">
            {{ item.available === 1 ? 'mdi-calendar-check' : 'mdi-calendar-remove' }}
          </v-icon>
        </template>
        <template #item.tag_new="{ item }">
          <v-icon :color="item.tag_new === 1 ? 'purple' : 'grey'">
            {{ item.tag_new === 1 ? 'mdi-star' : 'mdi-star-off' }}
          </v-icon>
        </template>

        <!-- ✅ 操作按钮列 -->
        <template #item.actions="{ item, index }">
          <v-btn icon color="deep-purple" @click="openForm(item, index)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteProperty(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 弹窗 -->
    <PropertyFormDialog
      v-model:modelValue="showForm"
      :formData="editForm"
      :editIndex="editIndex"
      @save="saveProperty"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PropertyFormDialog from '../../components/houseDetail/PropertyFormDialog.vue'

const properties = ref([])

const headers = [
  { title: '房源编号', key: 'house_num' },
  { title: '标题', key: 'title' },
  { title: '小区', key: 'community' },
  { title: '面积(㎡)', key: 'area', align: 'center' },
  { title: '朝向', key: 'direction', align: 'center' },
  { title: '户型', key: 'rooms', align: 'center' },
  { title: '租金(元/月)', key: 'price', align: 'right' },
  { title: '装修', key: 'decoration', align: 'center' },
  { title: '租赁方式', key: 'rent_type', align: 'center' },
  { title: '近地铁', key: 'subway', align: 'center' },
  { title: '随时看房', key: 'available', align: 'center' },
  { title: '是否新上', key: 'tag_new', align: 'center' },
  { title: '发布时间', key: 'publish_time', align: 'center' },
  { title: '浏览量', key: 'page_views', align: 'right' },
  { title: '操作', key: 'actions', sortable: false, align: 'center' },
]

const showForm = ref(false)
const editIndex = ref(null)
const editForm = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/')  // 这里根据你的后端调整路由
    if (res.ok) {
      properties.value = await res.json()
    } else {
      console.error('获取房源失败')
    }
  } catch (e) {
    console.error('请求异常', e)
  }
})

function openForm(item = null, index = null) {
  if (item) {
    editForm.value = JSON.parse(JSON.stringify(item))
    editIndex.value = index
  } else {
    editForm.value = null
    editIndex.value = null
  }
  showForm.value = true
}

async function saveProperty(newData) {
  if (editIndex.value !== null) {
    // 更新已有房源，用后端的 house_id 调接口
    const id = properties.value[editIndex.value].house_id
    try {
      const res = await fetch(`/api/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
      if (res.ok) {
        const updated = await res.json()
        properties.value[editIndex.value] = updated.data  // 你的接口返回 {data: house}
        showForm.value = false
      } else {
        alert('更新失败，请检查输入')
      }
    } catch (e) {
      alert('更新请求异常')
      console.error(e)
    }
  } else {
    // 新增房源
    try {
      const res = await fetch('/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
      if (res.ok) {
        const created = await res.json()
        properties.value.push(created.data)  // 新增的房源对象
        showForm.value = false
      } else {
        alert('新增失败，请检查输入')
      }
    } catch (e) {
      alert('新增请求异常')
      console.error(e)
    }
  }
}

async function deleteProperty(index) {
  const id = properties.value[index].house_id
  if (!confirm(`确定删除房源编号 ${properties.value[index].house_num} 吗？`)) return
  try {
    const res = await fetch(`/api/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      properties.value.splice(index, 1)
    } else {
      alert('删除失败')
    }
  } catch (e) {
    alert('删除请求异常')
    console.error(e)
  }
}
</script>

