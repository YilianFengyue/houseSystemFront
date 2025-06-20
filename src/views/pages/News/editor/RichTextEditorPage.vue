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
//导入用户信息
import { useProfileStore } from "@/stores/profileStore";
const profileStore = useProfileStore();
const user = reactive({ ...profileStore.user });

//导入消息条
import { useSnackbarStore } from "@/stores/snackbarStore";
const snackbarStore = useSnackbarStore();

// 导入并初始化 Vue Router
import { useRouter } from 'vue-router';
const router = useRouter();

//导入axios
import axios from "axios";

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
//文件

//新闻测试：
import NewsPreviewCard from "./NewsPreviewCard.vue";
const sampleNews = ref({
  title: "明日方舟周年活动", // 这个title会被优先使用
  content: `<h1>发布您的房源！~</h1><p>这是通过prop传递的详细内容...</p><img src="https://flaskhousesystem.oss-cn-hangzhou.aliyuncs.com/property_detail_pending/8ba34eb31b004dc49b630ad46b46c97b.png" alt="示例图片"><blockquote><p>核心摘要！</p></blockquote>`,
  coverImageUrl: '', // 替换成真实的或测试用的URL
  author: 'Lappand',
  publishDate: '2025年6月2日'
});
const submit = async () => {
  if (editor.value) {
    const content = editor.value.getHTML();
    console.log("发布内容：", content);
    console.log("发布标题：", sampleNews.value.title);
    console.log("发布作者：", user.name);
    console.log("发布日期：", new Date().toLocaleDateString());
    console.log("封面图片URL：", sampleNews.value.coverImageUrl);
    const payload = {
      author: user.name,                 
      content,                          
      title: sampleNews.value.title,
      coverImageUrl: sampleNews.value.coverImageUrl,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/news",
        payload
      );
      snackbarStore.showSuccessMessage("发布成功！");
      console.log("发布成功：", response.data);
       setTimeout(() => {
      router.push('/newsList'); // <-- 4. 3秒后跳转到新闻列表页
    }, 3000);
    } catch (error) {
      snackbarStore.showErrorMessage("发布失败，请稍后再试。");
      console.error("发布失败：", error);
    }
  }
};
const uploadCoverImage = async (files: File[] | File | null) => {
   console.log('uploadCoverImage 函数被触发，接收到的参数是:', files);
  // v-file-input 在单选场景仍可能给 File[]，先归一化
  const file: File | undefined =
    Array.isArray(files) ? files[0] : (files as File | undefined);
  console.log('归一化处理后的 file 对象是:', file);
  if (!file) {
    snackbarStore.showErrorMessage('请先选择图片文件');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);          // 只放一个 File

  try {
    const { data } = await axios.post(
      'http://localhost:5000/oss/upload_general_image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
        for (const [k, v] of formData.entries()) {
      console.log(k, v);            // 应看到 image File
    }
    if (data.success && data.image_url) {
      sampleNews.value.coverImageUrl = data.image_url;   // 更新预览
      snackbarStore.showSuccessMessage('封面上传成功');
    } else {
      snackbarStore.showErrorMessage(`封面上传失败：${data.message || '未知错误'}`);
    }
  } catch (err: any) {
    snackbarStore.showErrorMessage(
      `封面上传请求失败：${err.response?.data?.message || err.message || '请检查网络'}`
    );
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
          <v-text-field label="新闻标题" variant="solo" class=" mx-2"  v-model="sampleNews.title"></v-text-field>
           <v-file-input
            label="上传新闻封面"
            variant="solo"
            accept="image/*"
            prepend-icon="mdi-image"
            class=" mx-4"
            @update:modelValue="uploadCoverImage"
            clearable
          />
          <v-divider></v-divider>
                <v-img
          v-if="sampleNews.coverImageUrl"
          :src="sampleNews.coverImageUrl"
           height="250px" 
            cover 
            class="white--text align-end ml-4 mr-4 mt-4"
          />   
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

    <!-- <v-col cols="12"md="9" class="d-flex justify-center mt-4">
      
        <NewsPreviewCard :newsItem="sampleNews" />
        
      
       
    </v-col> -->
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
