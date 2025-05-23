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
        <template #item.id="{ item }">
          {{ item.id }}
        </template>

        <template #item.content="{ item }">
          <span :title="item.content">
            {{ item.content.length > 50 ? item.content.substring(0, 50) + '...' : item.content }}
          </span>
        </template>

        <template #item.publish_time="{ item }">
          {{ formatDate(item.publish_time) }}
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
            :value="formatDate(editForm.publish_time)"
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
  { key: "id", title: "新闻ID", sortable: false },
  { key: "title", title: "标题", sortable: false },
  { key: "content", title: "内容", sortable: false },
  { key: "publish_time", title: "发布时间", sortable: false },
  { key: "actions", title: "操作", sortable: false, align: "center" },
];

const showEditDialog = ref(false);
const editIndex = ref(null);
const editForm = ref({ id: null, title: "", content: "", publish_time: "" });

async function fetchNews() {
  try {
    const res = await fetch('http://localhost:5000/news');
    if (res.ok) {
      const data = await res.json();
      landlordNews.value = Array.isArray(data.data.items) ? data.data.items : [];
      console.log('新闻列表加载成功', landlordNews.value);
    } else {
      alert("获取新闻失败: " + res.statusText);
    }
  } catch (e) {
    alert("请求异常");
    console.error('获取新闻失败:', e);
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
    console.log('编辑新闻项:', item);
    editForm.value = {
      id: item.id,
      title: item.title,
      content: item.content,
      publish_time: item.publish_time ? item.publish_time.slice(0, 10) : getCurrentDate(),
    };
    editIndex.value = index;
  } else {
    editForm.value = { id: null, title: "", content: "", publish_time: getCurrentDate() };
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
  const id = editForm.value.id;
  const title = editForm.value.title.trim();
  const content = editForm.value.content.trim();
  const publish_time = editForm.value.publish_time;

  if (!title || !content) {
    alert("请填写完整信息");
    return;
  }

  try {
    let res, responseData;
    
    if (editIndex.value !== null) {
      // 编辑，PUT请求
      res = await fetch(`http://localhost:5000/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, publish_time }),
      });
      
      if (res.ok) {
        responseData = await res.json();
        console.log('更新成功，服务器返回:', responseData);
        
        // 找到列表中对应的项并更新
        const itemIndex = landlordNews.value.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          // 使用服务器返回的数据更新现有项
          // 注意：假设服务器返回完整的新闻对象
          landlordNews.value[itemIndex] = {
            ...landlordNews.value[itemIndex],  // 保留现有属性
            ...responseData.data || responseData  // 合并服务器返回的数据
          };
          
          // 强制更新引用以确保响应式更新
          landlordNews.value = [...landlordNews.value];
          console.log('更新后的新闻列表:', landlordNews.value);
        } else {
          console.error('找不到要更新的新闻项，ID:', id);
          alert('更新失败：找不到新闻项');
        }
        
        closeEditDialog();
      } else {
        alert("更新失败: " + res.statusText);
      }
    } else {
      // 新增，POST请求
      res = await fetch('http://localhost:5000/news', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, publish_time }),
      });
      
      if (res.ok) {
        responseData = await res.json();
        console.log('新增成功，服务器返回:', responseData);
        
        // 将新新闻添加到数组开头而不是末尾
        const newNews = responseData.data || responseData;
        landlordNews.value.unshift(newNews);
        
        // 强制更新引用以确保响应式更新
        landlordNews.value = [...landlordNews.value];
        console.log('新增后的新闻列表:', landlordNews.value);
        
        closeEditDialog();
      } else {
        alert("新增失败: " + res.statusText);
      }
    }
  } catch (e) {
    alert("请求异常");
    console.error(e);
  }
}

async function confirmDelete(item, index) {
  if (!confirm("确认删除该新闻吗？")) return;
  try {
    const res = await fetch(`http://localhost:5000/news/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      landlordNews.value.splice(index, 1);
    } else {
      alert("删除失败: " + res.statusText);
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