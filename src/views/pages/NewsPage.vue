<template>
  <News :newsList="newsData" />
  <div>

    <!-- 房东新闻管理 -->
    <div class="mt-8 px-4">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-2xl font-bold">房东新闻管理</h2>
        <v-btn color="primary" @click="openEditDialog()">新建新闻</v-btn>
      </div>

      <v-data-table
        :headers="headers"
        :items="landlordNews"
        class="elevation-1"
        item-key="id"
        dense
      >
        <template #item.actions="{ item, index }">
          <v-btn icon color="primary" @click="openEditDialog(item, index)" :title="'编辑 ' + item.title">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="confirmDelete(item, index)" :title="'删除 ' + item.title">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- 编辑对话框 -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editIndex === null ? "新增新闻" : "编辑新闻" }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="editForm.title" label="标题" />
          <v-textarea v-model="editForm.content" label="内容" rows="4" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeEditDialog">取消</v-btn>
          <v-btn color="primary" @click="saveNews">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>

import News from '../../components/houseDetail/News.vue'

const newsData = [
  {
    title: "北京租赁市场回暖，空置率下降",
    content: "北京市核心区域的住宅空置率同比下降了5%。随着政策利好，租赁市场持续回暖，租金稳中有升。",
    bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "上海二手房均价创新高",
    content: "上海市区二手房均价突破5万元/平方米，市场竞争加剧。",
    bgImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "装修品质成选择关键",
    content: "近七成租客更倾向于选择装修精良的房源，装修标准逐渐成为竞争力焦点。",
    bgImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
  }
]

import { ref } from "vue";
import axios from "axios";


// 新闻数据（前端维护）
const landlordNews = ref([
  { id: 1, title: "租赁新政策", content: "近期出台了新的租赁政策。" },
  { id: 2, title: "维修服务升级", content: "维修服务时间缩短至24小时内响应。" },
]);

const headers = [
  { text: "标题", value: "title", sortable: false },
  { text: "内容", value: "content", sortable: false },
  { text: "操作", value: "actions", sortable: false, align: "center" },
];

const showEditDialog = ref(false);
const editIndex = ref(null);
const editForm = ref({ title: "", content: "" });

// 打开编辑弹窗
function openEditDialog(item = null, index = null) {
  if (item) {
    editForm.value = { ...item };
    editIndex.value = index;
  } else {
    editForm.value = { title: "", content: "" };
    editIndex.value = null;
  }
  showEditDialog.value = true;
}

// 关闭弹窗
function closeEditDialog() {
  showEditDialog.value = false;
}

// 保存新闻（新增 or 编辑）
async function saveNews() {
  const { title, content } = editForm.value;
  if (!title || !content) return alert("请填写完整信息");
  closeEditDialog();

  if (editIndex.value !== null) {
    const id = landlordNews.value[editIndex.value].id;
    landlordNews.value[editIndex.value] = { id, title, content };
    await axios.put(`/api/news/${id}`, { title, content });
  } else {
    const newId = Date.now();
    landlordNews.value.push({ id: newId, title, content });
    await axios.post("/api/news", { id: newId, title, content });
  }

}

// 删除新闻
async function confirmDelete(item, index) {
  if (confirm("确认删除该新闻吗？")) {
    landlordNews.value.splice(index, 1);
    await axios.delete(`/api/news/${item.id}`);
  }
}
</script>

<style scoped>
.mt-8 {
  margin-top: 2rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.v-sheet > div {
  user-select: none;
}
</style>
