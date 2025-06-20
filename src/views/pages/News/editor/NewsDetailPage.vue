<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// 1. 修正导入路径：因为组件在同级目录，所以使用 ./
import NewsPreviewCard from './NewsPreviewCard.vue'; 
import { useSnackbarStore } from '@/stores/snackbarStore';

// 为本页面定义清晰的数据接口
interface NewsItemData {
  id: number;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string | null; // 在组件内部，我们使用规范的命名
  publishDate: string; // 格式化后的日期，用于展示
}

const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();

const newsItem = ref<NewsItemData | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const fetchNewsDetail = async () => {
  const newsId = route.params.id;
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`http://localhost:5000/news/${newsId}`);
    
    if (response.data && response.data.success) {
      const rawData = response.data.data;
      
      // 2. 将从后端获取的数据，映射到我们前端规范的接口上
      newsItem.value = {
        id: rawData.id,
        title: rawData.title,
        author: rawData.author,
        content: rawData.content,
        // ▼▼▼ 这里处理了后端字段的拼写错误 ▼▼▼
        coverImageUrl: rawData.coverImgeUrl, 
        // 将 publish_time 格式化成需要的日期字符串
        publishDate: new Date(rawData.publish_time).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    } else {
      throw new Error(response.data.message || '无法加载新闻数据');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '请求失败，新闻不存在或网络错误。';
    snackbarStore.showErrorMessage(error.value);
  } finally {
    loading.value = false;
  }
};

const shareNews = async () => {
  if (!newsItem.value) return;

  const shareData = {
    title: newsItem.value.title,
    text: `来看看这篇新闻: ${newsItem.value.title}`,
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(window.location.href);
    snackbarStore.showSuccessMessage('页面链接已复制到剪贴板');
  }
};

onMounted(() => {
  fetchNewsDetail();
});
</script>

<template>
  <v-container>
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey-darken-1">新闻加载中...</p>
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      title="加载失败"
      :text="error"
      variant="tonal"
      class="my-5"
    >
        <template v-slot:append>
            <v-btn @click="router.back()" color="error">返回</v-btn>
        </template>
    </v-alert>

    <div v-else-if="newsItem">
      <NewsPreviewCard :news-item="newsItem" />

      <v-sheet rounded="lg" class="pa-4 mt-6 text-center" border>
        <v-btn @click="shareNews" color="primary" prepend-icon="mdi-share-variant" class="mx-2">
          分享
        </v-btn>
        <v-btn @click="router.back()" variant="text" class="mx-2">
          返回列表
        </v-btn>
      </v-sheet>
    </div>
  </v-container>
</template>

<style scoped>
.v-container {
  max-width: 1000px;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>