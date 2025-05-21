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
        item-key="news_id"
        dense
      >
        <template #item.news_id="{ item }">
          {{ item.news_id }}
        </template>

        <template #item.content="{ item }">
          <span :title="item.content">
            {{ item.content.length > 30 ? item.content.slice(0, 30) + "..." : item.content }}
          </span>
        </template>

        <template #item.publishedAt="{ item }">
          {{ formatDate(item.publishedAt) }}
        </template>

        <template #item.actions="{ item, index }">
          <v-btn
            icon
            color="primary"
            @click="openEditDialog(item, index)"
            :title="'编辑 ' + item.title"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            @click="confirmDelete(item, index)"
            :title="'删除 ' + item.title"
          >
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
          <v-text-field
            label="发布时间"
            :value="formatDate(editForm.publishedAt)"
            readonly
          />
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
import { ref, onMounted } from "vue";

const landlordNews = ref([]);

const headers = [
  { text: "新闻ID", value: "news_id", sortable: false },
  { text: "标题", value: "title", sortable: false },
  { text: "内容", value: "content", sortable: false },
  { text: "发布时间", value: "publishedAt", sortable: false },
  { text: "操作", value: "actions", sortable: false, align: "center" },
];

const showEditDialog = ref(false);
const editIndex = ref(null);
const editForm = ref({ news_id: null, title: "", content: "", publishedAt: "" });

async function fetchNews() {
  try {
    const res = await fetch("/news");
    if (res.ok) {
      landlordNews.value = await res.json();
    } else {
      alert("获取新闻失败");
    }
  } catch (e) {
    alert("请求异常");
    console.error(e);
  }
}

onMounted(() => {
  fetchNews();
});

// 获取当前日期yyyy-mm-dd格式
function getCurrentDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function openEditDialog(item = null, index = null) {
  if (item) {
    editForm.value = {
      news_id: item.news_id,
      title: item.title,
      content: item.content,
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : getCurrentDate(),
    };
    editIndex.value = index;
  } else {
    editForm.value = { news_id: null, title: "", content: "", publishedAt: getCurrentDate() };
    editIndex.value = null;
  }
  showEditDialog.value = true;
}

function closeEditDialog() {
  showEditDialog.value = false;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
}

async function saveNews() {
  const news_id = editForm.value.news_id;
  const title = editForm.value.title.trim();
  const content = editForm.value.content.trim();
  const publishedAt = editForm.value.publishedAt;

  if (!title || !content) {
    alert("请填写完整信息");
    return;
  }

  if (editIndex.value !== null) {
    // 编辑，PUT请求
    try {
      const res = await fetch(`/news/${news_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, publishedAt }),
      });
      if (res.ok) {
        const updated = await res.json();
        landlordNews.value[editIndex.value] = updated;
        closeEditDialog();
      } else {
        alert("更新失败");
      }
    } catch (e) {
      alert("更新请求异常");
      console.error(e);
    }
  } else {
    // 新增，POST请求
    try {
      const res = await fetch("/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, publishedAt }),
      });
      if (res.ok) {
        const created = await res.json();
        landlordNews.value.push(created);
        closeEditDialog();
      } else {
        alert("新增失败");
      }
    } catch (e) {
      alert("新增请求异常");
      console.error(e);
    }
  }
}

async function confirmDelete(item, index) {
  if (!confirm("确认删除该新闻吗？")) return;
  try {
    const res = await fetch(`/news/${item.news_id}`, { method: "DELETE" });
    if (res.ok) {
      landlordNews.value.splice(index, 1);
    } else {
      alert("删除失败");
    }
  } catch (e) {
    alert("删除请求异常");
    console.error(e);
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
