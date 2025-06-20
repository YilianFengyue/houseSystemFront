<!--
* @Component: NewsDisplay
* @Maintainer: J.K. Yang
* @Description: 新闻展示界面
-->
<script setup lang="ts">
import { onMounted } from 'vue';

// 新闻数据接口
interface NewsItem {
  id: number;
  title: string;
  author: string;
  content: string;
  coverImgeUrl: string | null;
  publish_time: string;
}

//页面跳转
// 1. 从 vue-router 导入 useRouter
import { useRouter } from 'vue-router';
const router = useRouter();
const navigateToDetail = (item: NewsItem) => { 
  router.push(`/newsDetail/${item.id}`);
};
// 新闻列表
const newsList = ref<NewsItem[]>([]);

// ▼▼▼ 新增两个独立的状态 ▼▼▼
// 1. 用于时间范围过滤的状态
const filterType = ref<string>('all'); // 默认不过滤
const filterList = ref([
  { title: '全部时间', value: 'all' },
  { title: '今日新闻', value: 'today' },
  { title: '本周新闻', value: 'week' },
  { title: '本月新闻', value: 'month' },
]);

// 2. 用于排序的状态
const sortOrder = ref<string>('latest'); // 默认最新发布
const sortList = ref([
  { title: '最新发布', value: 'latest' },
  { title: '最早发布', value: 'earliest' },
]);
const getPlainText = (html: string | null | undefined): string => {
  // 增加一个安全检查，如果输入是 null 或 undefined，返回空字符串
  if (!html) {
    return '';
  }

  // 因为这个方法依赖浏览器的 DOM API，所以最好在客户端使用
  // 这个判断可以防止在服务器端渲染 (SSR) 环境下报错
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  
  // 如果不在浏览器环境，提供一个简单的备用方案
  return html.replace(/<[^>]*>?/gm, '');
};
// ▼▼▼ 重构核心计算属性 filteredList ▼▼▼
const filteredList = computed(() => {
  if (!Array.isArray(newsList.value)) {
    return [];
  }

  // --- 第1步：应用搜索过滤 ---
  let processedList = newsList.value.filter((item) => {
    const searchLower = search.value.toLowerCase();
    // 使用可选链 ?. 和空字符串 '' 保证安全
    return (
      (item.title || '').toLowerCase().includes(searchLower) ||
      (item.author || '').toLowerCase().includes(searchLower) ||
      (getPlainText(item.content) || '').toLowerCase().includes(searchLower) // 建议在纯文本上搜索
    );
  });
  // --- 第2步：应用时间范围过滤 ---
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filterType.value) {
    case "today":
      processedList = processedList.filter(item => new Date(item.publish_time) >= today);
      break;
    case "week":
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      processedList = processedList.filter(item => new Date(item.publish_time) >= weekAgo);
      break;
    case "month":
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      processedList = processedList.filter(item => new Date(item.publish_time) >= monthAgo);
      break;
    // case 'all' 时，不做任何处理
  }

  // --- 第3步：应用排序 ---
  // 注意：Array.prototype.sort() 会修改原数组，所以我们先用 [... ] 创建一个副本再排序
  return [...processedList].sort((a, b) => {
    const dateA = new Date(a.publish_time).getTime();
    const dateB = new Date(b.publish_time).getTime();
    return sortOrder.value === "earliest" ? dateA - dateB : dateB - dateA;
  });
});
// 搜索
const search = ref<string>("");

// 加载状态
const loading = ref<boolean>(false);

// 获取新闻数据
const fetchNews = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:5000/news?page=1&per_page=999');
    const data = await response.json();
    
   
    if (data && data.success && data.data && Array.isArray(data.data.items)) {
     
      newsList.value = data.data.items;
    } else {
      // 如果格式不符，打印错误并清空列表
      console.error('API返回的数据格式不正确或查询失败:', data);
      newsList.value = [];
    }
    // ▲▲▲ 修改这部分逻辑 ▲▲▲
    
    console.log('获取到的新闻数据:', newsList.value);
  } catch (error) {
    console.error('获取新闻失败:', error);
    newsList.value = [];
  } finally {
    loading.value = false;
  }
};


 


// 格式化发布时间
const formatPublishTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
//分享信息
// 导入 Snackbar store，用于显示提示信息
import { useSnackbarStore } from "@/stores/snackbarStore";
const snackbarStore = useSnackbarStore();

// 新增的分享方法
const shareNews = async (item: NewsItem) => {
  // 构造分享链接，这里假设新闻详情页的路由是 /news/:id
  // 即使现在没有这个页面，也建议使用这种规范的 URL 结构
  const shareUrl = `${window.location.origin}/news/${item.id}`;

  const shareData = {
    title: item.title,
    text: `来看看这篇来自 ${item.author} 的新闻`, // 分享的描述文本
    url: shareUrl,
  };

  // 检查是否支持 Web Share API
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log('新闻分享成功');
    } catch (err) {
      // 用户取消了分享
      console.log('分享被取消', err);
    }
  } else {
    // 不支持 Web Share API 的降级方案：复制到剪贴板
    try {
      await navigator.clipboard.writeText(shareUrl);
      snackbarStore.showSuccessMessage('链接已复制到剪贴板');
    } catch (err) {
      snackbarStore.showErrorMessage('复制链接失败');
      console.error('复制失败: ', err);
    }
  }
};
// 获取作者头像颜色
const getAvatarColor = (author: string) => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
  const index = author.charCodeAt(0) % colors.length;
  return colors[index];
};

onMounted(() => {
  // 初始化时获取新闻数据
  fetchNews();
  
  
});
</script>

<template>
  <v-card rounded variant="flat" class="text-blue-grey-darken-3 mb-5 mt-5" 
  hover 
  >
    <div class="d-flex align-center pa-4">
      <!-- 时间筛选 -->
      <v-menu>
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" variant="text" color="primary" class="mr-2">
      <v-icon class="mr-2">mdi-calendar-month</v-icon>
      {{ filterList.find(f => f.value === filterType)?.title }}
      <v-icon class="ml-1">mdi-menu-down</v-icon>
    </v-btn>
  </template>
  <v-list>
    <v-list-item
      v-for="item in filterList"
      :key="item.value"
      @click="filterType = item.value"
    >
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>
<v-menu>
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" variant="text" color="primary" class="mr-4">
      <v-icon class="mr-2">mdi-sort</v-icon>
      {{ sortList.find(s => s.value === sortOrder)?.title }}
      <v-icon class="ml-1">mdi-menu-down</v-icon>
    </v-btn>
  </template>
  <v-list>
    <v-list-item
      v-for="item in sortList"
      :key="item.value"
      @click="sortOrder = item.value"
    >
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>
      <!-- 刷新按钮 -->
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="fetchNews"
        :loading="loading"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>

      <!-- 搜索 -->
      <v-spacer></v-spacer>
      <div style="width: 350px">
        <v-text-field
          v-model="search"
          color="primary"
          variant="outlined"
          hide-details
          density="compact"
          filled
          rounded
          placeholder="搜索新闻标题、作者或内容..."
          clearable
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>
  </v-card>

  <v-sheet>
    <perfect-scrollbar style="height: 800px">
      <v-container>
        <v-row align="stretch">
          <v-col
            v-for="item in filteredList"
            :key="item.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card 
              class="text-blue-grey-darken-3 h-100 d-flex flex-column"
              hover
              elevation="4"
              v-ripple
              @click="() => $emit('news-selected', item)"
            >
              <!-- 新闻标题和元信息 -->
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar :color="getAvatarColor(item.author)" size="40">
                    <span class="text-h6">{{ item.author.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                </template>
                
                <v-card-title class="text-h6 font-weight-bold">
                  {{ item.title }}
                </v-card-title>
                
                <v-card-subtitle class="d-flex align-center mt-1">
                  <v-icon size="small" class="mr-1">mdi-account</v-icon>
                  {{ item.author }}
                  <v-spacer></v-spacer>
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ formatPublishTime(item.publish_time) }}
                </v-card-subtitle>
              </v-card-item>

              <!-- 封面图片（如果有） -->
              <v-img 
                v-if="item.coverImgeUrl"
                :src="item.coverImgeUrl"
                height="200"
                cover
                class="mx-4"
              ></v-img>

              <!-- 新闻内容 -->
              <v-card-text class="flex-grow-1">
                <p class="text-body-1 text-truncate-multiline">
                  {{ getPlainText(item.content) }}
                </p>
              </v-card-text>

              <!-- 操作按钮 -->
              <v-card-actions>
                <v-btn variant="text" color="primary" @click="navigateToDetail(item)">
                  阅读全文
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" @click="shareNews(item)">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- 空状态 -->
        <v-row v-if="filteredList.length === 0 && !loading" justify="center">
          <v-col cols="12" class="text-center py-10">
            <v-icon size="64" color="grey">mdi-newspaper-variant-outline</v-icon>
            <p class="text-h6 text-grey mt-4">
              {{ search ? '没有找到相关新闻' : '暂无新闻数据' }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </perfect-scrollbar>
  </v-sheet>
</template>

<style scoped lang="scss">
.text-truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  max-height: 4.5em;
}




</style>