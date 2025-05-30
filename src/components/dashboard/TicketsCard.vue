<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CopyLabel from "@/components/common/CopyLabel.vue"; // 你已有的组件

const loading = ref(true);
const logItems = ref<any[]>([]); // 用于存储从 API 获取的日志
const selectedLog = ref<any>(null); // 用于存储当前选中的日志详情
const dialog = ref(false); // 控制详情弹窗的显示

// --- 新增：用于在弹窗中显示元数据的计算属性 ---
const logMetadata = computed(() => {
  if (!selectedLog.value) return [];
  return [
    { icon: 'mdi-clock-outline', label: '时间戳', value: formatTimestamp(selectedLog.value.timestamp) },
    {
      icon: 'mdi-alert-circle-outline', // 或者用 getLevelIcon(selectedLog.value.level) 获取动态图标
      label: '级别',
      value: selectedLog.value.level,
      isChip: true, // 特殊标记，表示这个值用 v-chip 显示
      chipColor: getChipColor(selectedLog.value.level || '')
    },
    { icon: 'mdi-puzzle-outline', label: '模块', value: selectedLog.value.module },
    { icon: 'mdi-function-variant', label: '函数名', value: selectedLog.value.func_name },
    { icon: 'mdi-pound', label: '行号', value: selectedLog.value.line_no },
  ].filter(item => item.value !== null && item.value !== undefined && item.value !== ''); // 过滤掉值为空的元数据项
});

// 1. 更新表头定义以匹配日志数据结构
const headers = [
  { text: "日志 ID", align: "start", value: "id" }, // value 对应 logItems 中对象的键名
  { text: "时间戳", value: "timestamp" },
  { text: "级别", value: "level" },
  { text: "模块", value: "module" },
  { text: "消息摘要", value: "message" },
  { text: "操作", sortable: false, align: "end", value: "action" },
];

// 2. 辅助函数：根据日志级别获取 Vuetify Chip 的颜色
const getChipColor = (level: string) => {
  level = level.toUpperCase();
  if (level === "ERROR" || level === "CRITICAL") return "pink";
  if (level === "WARNING") return "orange";
  if (level === "INFO") return "primary";
  if (level === "DEBUG") return "grey";
  return "default"; // 未知级别
};


const formatTimestamp = (isoString: string | null) => {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleString(); 
  } catch (e) {
    return isoString; 
  }
};

// 4. 辅助函数：截断过长的消息以便在表格中显示
const truncateMessage = (message: string | null, maxLength = 80) => {
  if (!message) return "";
  // 先移除 ANSI 转义码
  const ansiEscape = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;
  const cleanMessage = message.replace(ansiEscape, '');

  if (cleanMessage.length <= maxLength) return cleanMessage;
  return cleanMessage.substring(0, maxLength) + "...";
};


// 5. 获取日志数据的函数
const fetchLogs = async () => {
  loading.value = true;
  try {
    // 你可以添加分页参数 ?page=1&per_page=20 等
    const response = await fetch("http://localhost:5000/admin/logs");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.success && result.data && Array.isArray(result.data.logs)) {
      logItems.value = result.data.logs;
      // console.log('Fetched logs:', logItems.value); // 调试用
    } else {
      console.error("Failed to fetch logs or data format incorrect:", result);
      logItems.value = [];
    }
  } catch (error) {
    console.error("Error fetching logs:", error);
    logItems.value = [];
  } finally {
    loading.value = false;
  }
};

// 6. 打开日志详情弹窗的函数
const openDetails = (item: any) => {
  selectedLog.value = item;
  dialog.value = true;
};

// 7. 组件挂载时获取日志
onMounted(() => {
  fetchLogs();
});
</script>


<template>
  <div
    v-if="loading"
    class="h-full d-flex flex-grow-1 align-center justify-center"
  >
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else>
    <h6 class="text-h6 font-weight-bold pa-5 d-flex align-center">
      <span class="flex-fill">系统日志</span>
      <v-btn icon="mdi-refresh" variant="text" @click="fetchLogs" title="刷新日志"></v-btn>
    </h6>
    
    <v-table class="pa-3 logs-table" height="300px"> 
      <thead>
        <tr>
          <th class="text-left" v-for="header in headers" :key="header.value"> 
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="logItems.length === 0">
          <td :colspan="headers.length" class="text-center py-4">
            暂无日志记录。
          </td>
        </tr>
        <tr v-for="item in logItems" :key="item.id">
          <td class="font-weight-bold">
            <copy-label :text="`# ${item.id}`" />
          </td>
          <td>{{ formatTimestamp(item.timestamp) }}</td>
          <td>
            <v-chip
              size="small"
              :color="getChipColor(item.level)"
              class="font-weight-bold"
            >
              {{ item.level }}</v-chip
            >
          </td>
          <td class=" font-weight-bold">{{ item.module }}</td>
          <td class="log-message-cell"> 
            <copy-label :text="truncateMessage(item.message)" :copiableText="item.message"/>
          </td>
          <td>
            <v-btn
              elevation="0" 
              variant="tonal" 
              size="small"
              @click="openDetails(item)"
            >
              查看详情
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    
<v-dialog v-model="dialog" max-width="900px" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold">日志详情 (ID: {{ selectedLog?.id }})</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 70vh;">

        <v-list density="compact" class="py-0"> 
          <v-list-item
            v-for="(meta, index) in logMetadata"
            :key="index"
            density="compact"
            class="log-meta-item"
            min-height="40px" 
          >
            <template v-slot:prepend>
              <v-icon :icon="meta.icon" color="primary" class="mr-4"></v-icon> 
            </template>

            <div class="d-flex align-center" style="width: 100%;">
              <span class="font-weight-medium mr-2 text-body-2" style="min-width: 70px; color: #555;">{{ meta.label }}:</span>
              <div class="meta-value text-body-2">
                <v-chip
                  v-if="meta.isChip"
                  density="comfortable"
                  size="small" 
                  :color="meta.chipColor"
                  class="font-weight-bold px-2"
                  label
                >
                  {{ meta.value }}
                </v-chip>
                <span v-else>{{ meta.value }}</span>
              </div>
            </div>
          </v-list-item>
        </v-list>

       
        <div class="mt-4"> 
          <p class="font-weight-bold mb-1 text-body-1">消息:</p> 
          <pre class="log-detail-pre">{{ selectedLog?.message?.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '') }}</pre>
        </div>

        <div v-if="selectedLog?.traceback" class="mt-3">
          <p class="font-weight-bold mb-1 text-body-1">Traceback:</p> 
          <pre class="log-detail-pre">{{ selectedLog?.traceback }}</pre>
        </div>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" class="font-weight-bold" @click="dialog = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  </div>
</template>

<style lang="scss" scoped>
// 原有样式 ...
.v-table {
  table {
    padding: 4px;
    padding-bottom: 8px;

    th {
      text-transform: uppercase;
      white-space: nowrap;
      font-weight: bold; // 表头加粗
      background-color: #f9f9f9; // 轻微背景色
    }

    td {
      border-bottom: 1px solid #eee !important; // 细边框线
      vertical-align: middle; // 垂直居中
    }

    tbody {
      tr {
         transition: box-shadow 0.2s, transform 0.2s;

        &:hover {
          box-shadow: 0 3px 15px -2px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }
      }
    }
  }
}

// 新增样式
.log-message-cell {
  max-width: 400px; // 限制消息单元格的最大宽度
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; // 防止消息换行，配合 ellipsis
}

.log-detail-pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f0f0f0; // 背景色
  padding: 12px;
  border-radius: 4px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
    monospace; // 等宽字体
  font-size: 0.875rem; // 稍小字体
  line-height: 1.5;
  max-height: 400px; // 限制预格式化文本最大高度
  overflow-y: auto; 
}

.v-list-item-title {
    min-width: 80px; // 给标题留出固定宽度
    margin-right: 8px;
}
</style>