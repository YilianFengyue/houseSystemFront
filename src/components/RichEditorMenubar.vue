<script setup lang="ts">
import { ref } from "vue";
// import EditorMenu from "./EditorMenu.vue";
import { Icon } from "@iconify/vue";
import { useSnackbarStore } from "@/stores/snackbarStore";
const snackbarStore = useSnackbarStore();

import axios from "axios";
const props = defineProps({ editor: Object });


const isImageUploadDialogVisible = ref(false);

const selectedImageFileArray = ref<File[]>([]); 


const openImageUploadDialog = () => {
  selectedImageFileArray.value = []; // 清空上次选择
  isImageUploadDialogVisible.value = true;
};

// (4) 新的上传处理函数
const handleImageUploadAndInsert = async () => {
  if (!props.editor) return;
  if (selectedImageFileArray.value.length === 0 || !selectedImageFileArray.value[0]) {
    alert("请先选择一个图片文件！");
    return;
  }

  const fileToUpload = selectedImageFileArray.value[0];
  const formData = new FormData();
  formData.append('image', fileToUpload, fileToUpload.name); // 'image' 对应后端 request.files['image']

  try {
    // 显示加载状态 (如果需要，你可以添加一个 isUploading ref)
    const response = await axios.post('http://localhost:5000/oss/upload_general_image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success && response.data.image_url) {
      const imageUrl = response.data.image_url;
      props.editor.chain().focus().setImage({ src: imageUrl }).run();
      isImageUploadDialogVisible.value = false; // 关闭对话框
      
      snackbarStore.showSuccessMessage("图片上传成功！");
    } else {
      
      snackbarStore.showErrorMessage(`图片上传失败: ${response.data.message || '未知错误'}`);
    }
  } catch (error: any) {
    console.error("请求图片上传接口错误:", error);
    snackbarStore.showErrorMessage(`图片上传请求失败: ${error.response?.data?.message || error.message || '请检查网络或联系管理员。'}`);
  } finally {
   
  }
};


const items = ref([
  {
    icon: " mdi-format-bold",
    title: "加粗字体",
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive("bold"),
  },
  
  {
    icon: " mdi-format-italic",
    title: "斜体",
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive("italic"),
  },
  {
    icon: " mdi-format-strikethrough-variant",
    title: "下划线",
    action: () => props.editor.chain().focus().toggleStrike().run(),

    isActive: () => props.editor.isActive("strike"),
  },
  
  {
    icon: " mdi-format-color-text",
    title: "突出显示",
    action: () => props.editor.chain().focus()?.toggleHighlight().run(),

    isActive: () => props.editor.isActive("highlight"),
  },
  {
    type: "divider",
  },
  {
    icon: "mdi-format-header-1",
    title: "Heading 1",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 1 }).run(),

    isActive: () => props.editor.isActive("heading", { level: 1 }),
  },
  {
    icon: "mdi-format-header-2",
    title: "Heading 2",
    action: () =>
      props.editor.chain().focus().toggleHeading({ level: 2 }).run(),

    isActive: () => props.editor.isActive("heading", { level: 2 }),
  },
  {
    icon: "mdi-format-paragraph",
    title: "段落大小",
    action: () => props.editor.chain().focus().setParagraph().run(),

    isActive: () => props.editor.isActive("paragraph"),
  },
  {
    icon: "mdi-format-list-bulleted",
    title: "无序列表",
    action: () => props.editor.chain().focus().toggleBulletList().run(),

    isActive: () => props.editor.isActive("bulletList"),
  },
  {
    icon: "mdi-format-list-numbered",
    title: "有序列表",
    action: () => props.editor.chain().focus().toggleOrderedList().run(),

    isActive: () => props.editor.isActive("orderedList"),
  },
  {
    icon: "mdi-image-plus-outline", // 或者用 "mdi-image", "mdi-image-area" 等你喜欢的图标
    title: "上传图片",
    action: openImageUploadDialog,
  },
  
  {
    type: "divider",
  },
  {
    icon: "mdi-format-quote-open",
    title: "引用块",
    action: () => props.editor.chain().focus().toggleBlockquote().run(),

    isActive: () => props.editor.isActive("blockquote"),
  },
  {
    icon: "mdi-minus",
    title: "下划线",
    action: () => props.editor.chain().focus().setHorizontalRule().run(),
  },
  {
    type: "divider",
  },
  {
    icon: "mdi-wrap",
    title: "空行",
    action: () => props.editor.chain().focus().setHardBreak().run(),
  },
  {
    title: "清除格式",
    icon: "mdi-format-clear",
    action: () =>
      props.editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
  {
    type: "divider",
  },
  {
    icon: "mdi-undo",
    title: "撤销",
    action: () => props.editor.chain().focus().undo().run(),
  },
  {
    icon: "mdi-redo",
    title: "回撤",
    action: () => props.editor.chain().focus().redo().run(),
  },
]);
</script>
<template>
  <perfect-scrollbar class="d-flex align-center menuBar">
    <template v-for="(item, index) in items">
      <v-divider
        thickness="3"
        class="mx-1"
        inset
        vertical
        v-if="item.type === 'divider'"
      ></v-divider>
      <v-btn
        :active="item?.isActive ? item.isActive() : null"
        icon
        rounded="0"
        variant="text"
        @click="item.action"
        v-else
      >
        <v-icon>{{ item.icon }}</v-icon>
        <v-tooltip
          activator="parent"
          location="top"
          :text="item.title"
        ></v-tooltip>
      </v-btn>
    </template>
  </perfect-scrollbar>
  <v-dialog v-model="isImageUploadDialogVisible" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">上传图片到编辑器</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-file-input
                v-model="selectedImageFileArray"
                label="选择图片文件 (单张)"
                accept="image/png, image/jpeg, image/bmp, image/webp"
                prepend-icon="mdi-camera"
                show-size
                clearable
                :rules="[
                  value => !!value && value.length > 0 || '必须选择一个文件',
                  value => !value || !value.length || value[0].size < 5000000 || '图片大小应小于 5MB!', // 示例大小限制
                ]"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-container>
        <small>* 图片将上传至OSS，然后插入编辑器。</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-grey-lighten-1" variant="text" @click="isImageUploadDialogVisible = false">
          取消
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="handleImageUploadAndInsert">
          确认上传并插入
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<style lang="scss">
.menuBar {
  padding: 8px;
  overflow: auto;
  border-radius: 12px 12px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
