<!--
* @Component: MessageBoard
* @Maintainer: Your Name
* @Description: 留言板页面，用户可提交留言
-->
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useProfileStore } from "@/stores/profileStore";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import axios from "axios";

const route = useRoute();
const snackbarStore = useSnackbarStore();
const profileStore = useProfileStore();

// 计算属性获取houseId，如果没有则默认为1
const houseId = computed(() => {
  return route.params.houseId?.toString() || "1";
});

interface Message {
  id: number;
  content: string;
  username: string;
  timestamp: string;
  at?: number; // 回复的留言ID
  atUsername?: string; // 回复的用户名
}

// 当前用户从profileStore获取
const currentUser = ref(profileStore.user?.name || "");
const messages = ref<Message[]>([]);
const newMessage = ref("");
const isLoading = ref(false);

// 加载留言
const loadMessages = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`http://localhost:5000/comments/${houseId.value}`);
    
    // 处理空数据情况
    if (!response.data?.data) {
      messages.value = [];
      return;
    }

    // 转换数据格式
    const rawMessages = Array.isArray(response.data.data) ? response.data.data : [];
    messages.value = rawMessages.map((comment: any) => ({
      id: comment.comment_id,
      content: comment.desc,
      username: comment.username,
      timestamp: comment.time,
      at: comment.at || undefined
    }));

    // 为每条留言添加被回复的用户名
    messages.value.forEach(message => {
      if (message.at) {
        const repliedMessage = messages.value.find(m => m.id === message.at);
        if (repliedMessage) {
          message.atUsername = repliedMessage.username;
        }
      }
    });

  } catch (error) {
    // 404错误视为无留言，不显示错误提示
    if (axios.isAxiosError(error) && error.response?.status !== 404) {
      console.error("加载留言失败:", error);
      snackbarStore.showErrorMessage("加载留言失败，请稍后重试");
    }
    messages.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 提交留言
const submitMessage = async () => {
  if (!newMessage.value.trim()) {
    snackbarStore.showErrorMessage("留言内容不能为空");
    return;
  }

  if (!currentUser.value) {
    snackbarStore.showErrorMessage("请先登录后再留言");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/comments", {
      house_id: parseInt(houseId.value),
      username: currentUser.value,
      type: 1,
      desc: newMessage.value,
      at: null
    });

    if (response.status === 201) {
      const newComment = response.data.data;
      messages.value.unshift({
        id: newComment.comment_id,
        content: newComment.desc,
        username: newComment.username,
        timestamp: newComment.time
      });
      
      newMessage.value = "";
      snackbarStore.showSuccessMessage("留言已提交，感谢您的反馈！");
    }
  } catch (error) {
    console.error("提交留言失败:", error);
    snackbarStore.showErrorMessage("提交留言失败，请稍后重试");
  }
};

// 格式化时间显示
const formatTime = (timeString: string) => {
  return timeString;
};

// 监听用户信息变化
watch(() => profileStore.user, (newUser) => {
  currentUser.value = newUser?.name || "";
}, { deep: true });

// 监听houseId变化重新加载留言
watch(houseId, () => {
  loadMessages();
});

// 组件挂载时加载留言
onMounted(() => {
  loadMessages();
});
</script>

<template>
  <div class="message-board">
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="12">
          <!-- 加载状态 -->
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="mb-4"
          ></v-progress-linear>
          
          <!-- 留言列表 -->
          <v-card class="mb-6 pa-5" elevation="2" v-if="!isLoading && messages.length > 0">
            <h2 class="text-h5 mb-4">留言评论</h2>
            
            <perfect-scrollbar class="message-list" style="max-height: 500px;">
              <div v-for="(message, index) in messages" :key="index" class="mb-6">
                <div class="d-flex justify-space-between align-center mb-2">
                  <div>
                    <span class="font-weight-bold">{{ message.username }}</span>
                    <v-chip
                      v-if="message.username === currentUser"
                      size="small"
                      color="primary"
                      class="ml-2"
                    >
                      我的留言
                    </v-chip>
                    <span v-if="message.atUsername" class="text-caption text-grey ml-2">
                      回复 @{{ message.atUsername }}
                    </span>
                  </div>
                  <span class="text-caption text-grey">{{ formatTime(message.timestamp) }}</span>
                </div>
                
                <v-card variant="outlined" class="pa-4">
                  <md-preview :modelValue="message.content" />
                </v-card>
              </div>
            </perfect-scrollbar>
          </v-card>
          
          <!-- 无留言提示 -->
          <v-card 
            v-if="!isLoading && messages.length === 0" 
            class="mb-6 pa-5 text-center" 
            elevation="2"
          >
            <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-comment-outline</v-icon>
            <p class="text-h6">暂无留言</p>
            <p class="text-body-1 text-grey">快来发表第一条留言吧！</p>
          </v-card>
          
          <!-- 留言表单 -->
          <v-card class="pa-5" elevation="2">
            <h1 class="text-h4 text-center mb-6">留言板</h1>
            
            <p class="text-center mb-6">
              欢迎留下您的宝贵意见、建议或问题，我们会尽快查看并回复。
            </p>
            
            <!-- 用户信息提示 -->
            <v-alert
              v-if="currentUser"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              当前用户: {{ currentUser }}
            </v-alert>
            
            <v-alert
              v-else
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              请先登录后再留言
            </v-alert>
            
            <!-- 留言表单 -->
            <v-form @submit.prevent="submitMessage">
              <v-textarea
                v-model="newMessage"
                label="留言内容"
                variant="outlined"
                rows="5"
                required
                :disabled="!currentUser"
                class="mb-4"
              ></v-textarea>
              
              <div class="text-center">
                <v-btn
                  color="primary"
                  size="large"
                  type="submit"
                  :disabled="!currentUser"
                >
                  提交留言
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.message-board {
  padding: 2rem 0;
  
  .message-list {
    padding-right: 1rem;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
  }
}

:deep(.md-editor-preview-wrapper) {
  padding: 0;
  background-color: transparent !important;
}
</style>