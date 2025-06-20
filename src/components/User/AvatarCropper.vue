<script setup lang="ts">
import { ref, watch } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
// 注意：确保 'vue-advanced-cropper/dist/style.css' 已经在你的 main.ts 中全局导入

// --- 定义组件的接口 (Props & Emits) ---
const props = defineProps<{
  // 用于 v-model 控制对话框的显示/隐藏
  dialog: boolean;
}>();

const emit = defineEmits<{
  // 用于 v-model
  'update:dialog': [value: boolean];
  // 当用户确认裁剪后，触发此事件，并传递裁剪后的 Blob 数据和一个 done 回调
  'upload': [blob: Blob, done: () => void];
}>();


// --- 组件内部状态 ---
const imageSrc = ref<string | null>(null); // 存储待裁剪图片的Base64预览图
const cropperRef = ref<any>(null); // 裁剪器实例的引用
const fileInputRef = ref<HTMLInputElement | null>(null); // 文件输入框的引用
const isProcessing = ref(false); // 标记是否正在处理（例如，在裁剪或上传中）


// --- 组件方法 ---

// 触发隐藏的文件输入框
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// 重置状态，用于重新选择或关闭对话框
const reset = () => {
  imageSrc.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = ''; // 清空<input>的值，确保可以重复选择同一张图片
  }
};

// 当用户选择了文件
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // 基础验证
  if (!file.type.startsWith('image/')) {
    alert('请选择一个图片文件');
    return;
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB
    alert('图片大小不能超过 5MB');
    return;
  }

  // 读取文件并生成预览
  const reader = new FileReader();
  reader.onload = (e) => {
    imageSrc.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// 当用户点击“确认裁剪”
const onConfirmCrop = () => {
  if (!cropperRef.value) return;

  isProcessing.value = true;
  const { canvas } = cropperRef.value.getResult();

  if (canvas) {
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        // 定义一个"完成"的回调函数，父组件处理完上传后应调用它
        const done = () => {
          isProcessing.value = false;
        };
        // 触发 upload 事件，将 blob 和 done 函数都传给父组件
        emit('upload', blob, done);
      } else {
        alert('图片处理失败，请重试');
        isProcessing.value = false;
      }
    }, 'image/jpeg', 0.9); // 输出为高质量的JPG
  }
};

// 关闭对话框
const closeDialog = () => {
  reset();
  emit('update:dialog', false);
};

// 监听dialog prop的变化，在关闭时重置内部状态
watch(() => props.dialog, (isOpen) => {
  if (!isOpen) {
    reset();
  }
});

</script>

<template>
  <v-dialog 
    :model-value="dialog" 
    @update:model-value="closeDialog"
    max-width="550" 
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-circle-outline</v-icon>
        <span>更换头像</span>
        <v-spacer />
        <v-btn icon variant="text" @click="closeDialog" :disabled="isProcessing">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-divider />
      
      <v-card-text style="min-height: 400px;" class="d-flex align-center justify-center">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none;"
          @change="onFileSelected"
        />

        <div v-if="!imageSrc" class="upload-placeholder" @click="triggerFileInput">
          <v-icon size="64" color="grey-lighten-1">mdi-cloud-upload-outline</v-icon>
          <div class="text-h6 mt-3 text-grey-darken-1">点击或拖拽图片</div>
          <div class="text-caption text-grey">支持 JPG, PNG, WEBP (最大 5MB)</div>
        </div>

        <div v-else style="height: 400px; width: 100%;">
          <cropper
            ref="cropperRef"
            :src="imageSrc"
            stencil="circle"
            :stencil-props="{ aspectRatio: 1 }"
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn v-if="imageSrc" @click="triggerFileInput" :disabled="isProcessing">
          重新选择
        </v-btn>
        <v-spacer />
        <v-btn @click="closeDialog" :disabled="isProcessing">取消</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="onConfirmCrop"
          :loading="isProcessing"
          :disabled="!imageSrc"
        >
          确认并上传
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #1976d2; // Vuetify primary color
    background-color: #fafafa;
  }
}
</style>