<!--
* @Component: UserChatRoom
* @Maintainer: J.K. Yang
* @Description: 前后端分离的纯用户聊天室组件(测试版)
-->
<script setup lang="ts">
import { useProfileStore } from "@/stores/profileStore";
import { onMounted, ref, onUnmounted } from 'vue';
import { scrollToBottom } from "@/utils/common";
import { useSnackbarStore } from "@/stores/snackbarStore";

const profileStore = useProfileStore();
const snackbarStore = useSnackbarStore();
const signon = reactive({ ...profileStore.signon });

interface Message {
  message_id: string;
  content: string;
  sender_username: string;
  receiver_username: string;
  timestamp: number;
  is_read: boolean;
  channel_id: string;
}

interface User {
  userId: string;
  username: string;
  avatar: string;
  online: boolean;
}

// 当前聊天室ID
const channel_id = ref('public'); // 默认公共聊天室
// 用户输入消息
const userMessage = ref("");
// 消息列表
const messages = ref<Message[]>([]);
// 在线用户列表
const onlineUsers = ref<User[]>([]);
// 输入框行数
const inputRow = ref(1);
// 加载状态
const isLoading = ref(false);
// 模拟连接状态
const isConnected = ref(true);

// 生成模拟数据
const generateMockData = () => {
  // 模拟在线用户
  onlineUsers.value = [
    {
      userId: '1',
      username: '用户1',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      online: true
    },
    {
      userId: '2',
      username: '用户2',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      online: true
    },
    {
      userId: signon.userId,
      username: signon.username,
      avatar: signon.avatarUrl,
      online: true
    }
  ];

  // 模拟历史消息
  messages.value = [
    {
      message_id: '1',
      content: '你好，这是一个测试消息',
      sender_username: '用户1',
      receiver_username: 'public',
      timestamp: Date.now() - 3600000,
      is_read: true,
      channel_id: 'public'
    },
    {
      message_id: '2',
      content: '你好，这是另一个测试消息',
      sender_username: signon.username,
      receiver_username: 'public',
      timestamp: Date.now() - 1800000,
      is_read: true,
      channel_id: 'public'
    }
  ];
};

// 发送消息
const sendMessage = async () => {
  if (!userMessage.value.trim()) return;
  
  if (!isConnected.value) {
    snackbarStore.showErrorMessage('连接已断开，请刷新页面重试');
    return;
  }

  const newMessage: Message = {
    message_id: Date.now().toString(),
    content: userMessage.value,
    sender_username: signon.username,
    receiver_username: 'public', // 公共聊天室
    timestamp: Date.now(),
    is_read: false,
    channel_id: channel_id.value
  };

  try {
    // 模拟发送消息
    messages.value.push(newMessage);
    userMessage.value = "";
    scrollToBottom(document.querySelector(".message-container"));
    
    // 模拟对方回复
    setTimeout(() => {
      const replyMessage: Message = {
        message_id: (Date.now() + 1).toString(),
        content: `回复: ${newMessage.content}`,
        sender_username: '用户1',
        receiver_username: 'public',
        timestamp: Date.now(),
        is_read: false,
        channel_id: channel_id.value
      };
      messages.value.push(replyMessage);
      scrollToBottom(document.querySelector(".message-container"));
    }, 1000);
    
  } catch (error) {
    console.error('Error sending message:', error);
    snackbarStore.showErrorMessage('消息发送失败');
  }
};

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && (e.altKey || e.shiftKey)) {
    e.preventDefault();
    userMessage.value += "\n";
  } else if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
};

// 加载历史消息
const loadHistoryMessages = async () => {
  isLoading.value = true;
  try {
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Error loading history:', error);
  } finally {
    isLoading.value = false;
  }
};

// 加载在线用户
const loadOnlineUsers = async () => {
  try {
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('Error loading online users:', error);
  }
};

onMounted(async () => {
  // 生成模拟数据
  generateMockData();
  
  // 加载历史消息和在线用户
  await Promise.all([loadHistoryMessages(), loadOnlineUsers()]);
});
</script>

<template>
  <div class="chat-room">
    <div class="chat-container">
      <!-- 在线用户列表 -->
      <div class="user-list">
        <v-card>
          <v-card-title>在线用户 ({{ onlineUsers.length }})</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item 
                v-for="user in onlineUsers" 
                :key="user.userId"
                :prepend-avatar="user.avatar"
                :title="user.username"
              >
                <template v-slot:append>
                  <v-icon :color="user.online ? 'green' : 'grey'">
                    mdi-circle-small
                  </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </div>
      
      <!-- 聊天区域 -->
      <div class="messsage-area">
        <perfect-scrollbar v-if="messages.length > 0" class="message-container">
          <template v-for="message in messages" :key="message.message_id">
            <div class="pa-4" :class="{
              'user-message': message.sender_username === signon.username, 
              'other-message': message.sender_username !== signon.username
            }">
              <v-avatar class="ml-4" rounded="sm" variant="elevated">
                <img :src="onlineUsers.find(u => u.username === message.sender_username)?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                     :alt="message.sender_username" />
              </v-avatar>
              <v-card class="gradient gray text-pre-wrap" theme="dark">
                <v-card-title class="text-caption">
                  {{ message.sender_username }}
                  <span class="text-caption text-grey ml-2">
                    {{ new Date(message.timestamp).toLocaleTimeString() }}
                  </span>
                </v-card-title>
                <v-card-text>
                  {{ message.content }}
                  <v-icon v-if="message.is_read" small color="grey" class="ml-1">mdi-check-all</v-icon>
                </v-card-text>
              </v-card>
            </div>
          </template>
          <div v-if="isLoading" class="loading-indicator">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </perfect-scrollbar>
        <div class="no-message-container" v-else>
          <h1 class="text-h4 text-md-h2 text-primary font-weight-bold">
            聊天室
          </h1>
          <p class="text-grey">开始与其他人交流吧</p>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area">
      <v-sheet
        color="transparent"
        elevation="0"
        class="input-panel d-flex align-end pa-1"
      >
        <v-textarea
          class="mx-2"
          color="primary"
          type="text"
          clearable
          variant="solo"
          ref="input"
          v-model="userMessage"
          placeholder="输入消息..."
          hide-details
          @keydown="handleKeydown"
          :rows="inputRow"
          @focus="inputRow = 3"
          @blur="inputRow = 1"
          :disabled="!isConnected"
        >
        </v-textarea>
        <v-btn 
          class="mb-1" 
          color="primary" 
          variant="elevated" 
          icon 
          @click="sendMessage"
          :disabled="!isConnected"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-sheet>
      <div class="connection-status">
        <v-chip :color="isConnected ? 'green' : 'red'" small>
          {{ isConnected ? '已连接' : '已断开' }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-room {
  background-repeat: repeat;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .chat-container {
    display: flex;
    height: 100%;
  }

  .user-list {
    width: 250px;
    height: 100%;
    border-right: 1px solid #eee;
    overflow-y: auto;
  }

  .messsage-area {
    flex: 1;
    height: 100%;
  }

  .input-area {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 1rem;
    align-items: center;

    .input-panel {
      border-radius: 5px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .connection-status {
      text-align: center;
      margin-top: 8px;
    }
  }
}

.user-message {
  display: flex;
  align-content: center;
  justify-content: flex-end;
  
  .v-avatar {
    order: 2;
    margin-left: 16px;
  }
  
  .v-card {
    order: 1;
    background: linear-gradient(45deg, #2196F3, #00BCD4);
  }
}

.other-message {
  display: flex;
  align-content: center;
  justify-content: flex-start;
  
  .v-card {
    background: linear-gradient(45deg, #4CAF50, #8BC34A);
  }
}

.message-container {
  height: calc(100vh - 154px);
  padding-bottom: 80px;
  position: relative;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.no-message-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 16px;
  }
}

@media screen and (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }

  .user-list {
    width: 100%;
    height: auto;
    max-height: 150px;
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .message-container {
    height: calc(100vh - 300px);
  }
  
  .user-message, .other-message {
    font-size: 14px !important;
    padding: 8px !important;
    
    .v-avatar {
      width: 32px !important;
      height: 32px !important;
      margin-left: 8px !important;
    }
  }
}
</style>