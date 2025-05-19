<template>
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
        <!-- 内容截断展示 -->
        <template #item.content="{ item }">
          <span :title="item.content">
            {{ item.content.length > 30 ? item.content.slice(0, 30) + '...' : item.content }}
          </span>
        </template>

        <!-- 操作按钮 -->
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
import { ref } from "vue";

// 模拟新闻数据（前端维护）
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
function saveNews() {
  const title = editForm.value.title.trim();
  const content = editForm.value.content.trim();

  if (!title || !content) {
    alert("请填写完整信息");
    return;
  }

  closeEditDialog();

  if (editIndex.value !== null) {
    // 编辑
    const id = landlordNews.value[editIndex.value].id;
    landlordNews.value[editIndex.value] = { id, title, content };
  } else {
    // 新增，ID 自动递增
    const newId = Math.max(0, ...landlordNews.value.map(n => n.id)) + 1;
    landlordNews.value.push({ id: newId, title, content });
  }
}

// 删除新闻
function confirmDelete(item, index) {
  if (confirm("确认删除该新闻吗？")) {
    landlordNews.value.splice(index, 1);
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
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.justify-space-between {
  justify-content: space-between;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.font-bold {
  font-weight: bold;
}
</style>
