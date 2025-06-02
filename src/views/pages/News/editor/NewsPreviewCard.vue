<template>
  <v-sheet
    elevation="3"
    rounded="lg"
    class="news-preview-card mx-auto"
     
  >
    <v-img
      v-if="newsItem.coverImageUrl"
      :src="newsItem.coverImageUrl"
      height="250px" 
      cover 
      class="white--text align-end"
    >
     
   
    </v-img>
    <v-sheet
      v-else
      color="grey-lighten-3" 
      height="250px"
      class="d-flex align-center justify-center"
    >
      <div class="text-center text-grey-darken-1">
        <v-icon size="x-large">mdi-image-area</v-icon>
        <p class="mt-2 text-subtitle-1">封面图片预留</p>
      </div>
    </v-sheet>

    <div class="pa-5 pa-md-7">
      
      
      <h1 class="text-h4 font-weight-bold mb-3 text-grey-darken-3">
        {{ newsItem.title || '新闻标题加载中...' }}
      </h1>
     

     
      <div class="text-caption text-grey-darken-1 mb-4">
        <span v-if="newsItem.author" class="font-weight-bold ">作者: {{ newsItem.author }}</span>
        <span v-if="newsItem.publishDate" class="ml-4">发布于: {{ newsItem.publishDate }}</span>
      </div>

      <v-divider class="mb-5"></v-divider>

     
      <div class="tiptap-rendered-content" v-html="newsItem.content"></div>


    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue';

interface NewsItem {
  title: string; // 也可以从 content 的 h1 提取
  content: string; // 包含HTML的新闻内容
  coverImageUrl?: string; // 封面图URL (可选)
  author?: string;
  publishDate?: string; // 例如 "2025-06-02"
}

// 假设这个组件接收一个 newsItem 对象作为 prop
const props = defineProps({
  newsItem: {
    type: Object as PropType<NewsItem>,
    required: true,
    default: () => ({ 
      
      title: '默认新闻标题 (来自HTML)', 
      content: `<h1>发布您的房源！~</h1><p>来写一些什么新闻？</p><ul><li><p>也可以上传一些图片~</p></li></ul><p>发布介绍你房源的新闻或者页面吧！~</p><blockquote><p>你可以轻松做到！~ 👏 <br>— Author</p></blockquote><img src="https://flaskhousesystem.oss-cn-hangzhou.aliyuncs.com/property_detail_pending/8ba34eb31b004dc49b630ad46b46c97b.png" alt="示例图片">`,
      author: 'AI助手',
      publishDate: new Date().toLocaleDateString(),
      coverImageUrl: undefined, 
      
    })
  }
});



</script>

<style scoped lang="scss">
.news-preview-card {
 
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.12) !important; // 鼠标悬浮时加深阴影
  }
}


</style>

<style lang="scss">
// 如果你的 tiptap-content-styles.scss 没有全局导入，且 scoped 导入无法正确作用于 v-html 的内容，
// 你可能需要一个不带 scoped 的 <style> 块来导入它，或者将它提升到父组件或全局。
// 为了确保 v-html 内的样式生效，通常推荐将内容样式（tiptap-content-styles.scss）设为全局，
// 或者在这个组件的 <style> 标签不使用 scoped (但要小心样式冲突)。

// 一个比较好的做法是，确保 `.tiptap-rendered-content` 这个类在你的全局或父级样式中
// 已经定义了所有必要的子元素样式。
// 例如，在你的主 SCSS 文件或 App.vue 的样式中导入：
// @import '@/styles/tiptap-content-styles.scss';
</style>