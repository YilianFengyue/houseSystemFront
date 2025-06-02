<!--
* @Component: 
* @Maintainer: J.K. Yang
* @Description: 
-->
<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Image } from '@tiptap/extension-image'; 

import StarterKit from "@tiptap/starter-kit";
import EditorMenubar from "@/components/RichEditorMenubar.vue";
import MdEditorCard from "./MdEditorCard.vue";


// (2) 定义 addImage 方法
const addImage = () => {
  if (editor.value) { // editor 是一个 ref，需要通过 .value 访问
    const url = window.prompt('请输入图片 URL');
    if (url) {
      editor.value.chain().focus().setImage({ src: url }).run();
    }
  }
};

const editor = useEditor({
  extensions: [StarterKit, Image],
  content: `
  <h1>发布您的房源！~</h1><h2><strong>这是一篇测试新闻，漂亮的很呐
  </strong></h2><p></p><blockquote><p>的法国红酒看来是</p>
  </blockquote>
  <img src="https://flaskhousesystem.oss-cn-hangzhou.aliyuncs.com/general_uploads/cc7e5b220ad948d6983ab23e1e85708f.jpg">
  <p></p>
      `,
});
//新闻测试：
import NewsPreviewCard from "./NewsPreviewCard.vue";
const sampleNews = ref({
  title: "明日方舟周年活动", // 这个title会被优先使用
  content: `<h1>发布您的房源！~</h1><p>这是通过prop传递的详细内容...</p><img src="https://flaskhousesystem.oss-cn-hangzhou.aliyuncs.com/property_detail_pending/8ba34eb31b004dc49b630ad46b46c97b.png" alt="示例图片"><blockquote><p>核心摘要！</p></blockquote>`,
  coverImageUrl: 'https://i.pinimg.com/736x/e6/76/fe/e676fe19a501904fc4e5819fdb428d87.jpg', // 替换成真实的或测试用的URL
  author: 'Lappand',
  publishDate: '2025年6月2日'
});
const submit = () => {
  if (editor.value) {
    const content = editor.value.getHTML();
    console.log("发布的内容：", content);
    // 在这里处理发布逻辑，比如发送到服务器
  }
};
</script>

<template>
  <v-container>
    <v-row>
      
      <v-col cols="12" md="9">
        <v-card min-height="90vh">
          <v-card-title class="d-flex justify-center pb-4">
            <h2 class="font-weight-bold pa-3 ">发布您的房源新闻</h2>
          </v-card-title>
          <v-text-field label="新闻标题" variant="solo" class=" mx-2"></v-text-field>
          <v-divider></v-divider>
          <v-card-text class="mt-8">
            <div v-if="editor">
              <EditorMenubar :editor="editor" />
             
            </div>
            <div class="pa-5 ">
              <editor-content :editor="editor" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card min-height="50vh">
          <v-card-title>
            <h2 class="font-weight-bold pa-3">工具栏</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="mt-8"> <MdEditorCard @submit="submit" /> </v-card-text>
        </v-card>
      </v-col>

    <v-col cols="12"md="9" class="d-flex justify-center mt-4">
      
        <NewsPreviewCard :newsItem="sampleNews" />
        
      
       
    </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

.tiptap {
  :first-child {
    margin-top: 0;
  }

  img {
    display: block;
    height: auto;
    margin: 1.5rem 0;
    max-width: 100%;

    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8; /* 选一个你喜欢的高亮颜色 */
    }
  }
}

/* 为了让 editor-content 应用上面的样式，可能需要这样：*/
:deep(.tiptap) {
  :first-child {
    margin-top: 0;
  }

  img {
    display: block;
    height: auto;
    margin: 1.5rem 0;
    max-width: 100%;

    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }
}
</style>
