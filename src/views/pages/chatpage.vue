<template>
  <div class="chat-room">
    <div class="chat-container">
      <!-- 聊天区域 -->
      <div class="messsage-area">
        <perfect-scrollbar v-if="messages.length > 0" class="message-container">
          <template v-for="message in messages" :key="message.message_id">
            <div class="pa-4" :class="{
              'user-message': message.sender_username === currentUser,
              'other-message': message.sender_username !== currentUser
            }">
              <v-avatar class="ml-4" rounded="sm" variant="elevated">
                <img :src="message.sender_username === currentUser.value 
                  ? '~/public/images/head1.jpg' 
                  : '~/public/images/head2.jpg'" 
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
            {{ currentUser }}与LU的聊天室
          </h1>
          <p class="text-grey">开始与LU交流吧</p>
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

<script setup lang="ts">
import { useProfileStore } from "@/stores/profileStore";
import { onMounted, ref } from 'vue';
import { scrollToBottom } from "@/utils/common";
import { useSnackbarStore } from "@/stores/snackbarStore";
import io from 'socket.io-client';

// ---------------------------
// 默认用户已登录，固定为Andy
// ---------------------------
const currentUser = ref('Andy');
const profileStore = useProfileStore();
const snackbarStore = useSnackbarStore();

interface Message {
  message_id: string;
  content: string;
  sender_username: string;
  receiver_username: string;
  timestamp: number;
}

// 用户输入消息
const userMessage = ref("");
// 消息列表
const messages = ref<Message[]>([]);
// 输入框行数
const inputRow = ref(1);
// 加载状态
const isLoading = ref(false);
// 连接状态
const isConnected = ref(true);

// 连接到服务器
const socket = io('http://localhost:5000');

// 监听新消息事件
socket.on('new_message', (newMessage) => {
  messages.value.push({
    message_id: newMessage.message_id,
    content: newMessage.content,
    sender_username: newMessage.sender_username,
    receiver_username: newMessage.receiver_username,
    timestamp: new Date(newMessage.timestamp).getTime()
  });
  scrollToBottom(document.querySelector(".message-container"));
});

// 从后端API获取当前用户（Andy）和LU的消息
const fetchMessagesFromAPI = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:5000/comments/messages?user1=${currentUser.value}&user2=LU`);
    if (!response.ok) {
      throw new Error('获取消息失败');
    }
    const data = await response.json();
    if (data.code === 200) {
      messages.value = data.data.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).getTime()
      }));
    }
  } catch (error) {
    console.error('获取消息错误:', error);
    snackbarStore.showErrorMessage('获取历史消息失败');
  } finally {
    isLoading.value = false;
  }
};

// 发送消息到服务器
const sendMessageToServer = (message: Message) => {
  socket.emit('send_message', {
    sender_username: message.sender_username,
    receiver_username: message.receiver_username,
    content: message.content
  });
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
    sender_username: currentUser.value,
    receiver_username: 'LU',
    timestamp: Date.now()
  };

  try {
    // 发送到服务器
    sendMessageToServer(newMessage);
    userMessage.value = "";
    scrollToBottom(document.querySelector(".message-container"));
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

onMounted(async () => {
  // 从API加载当前用户（Andy）和LU的消息
  await fetchMessagesFromAPI();
});
</script>

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
  .message-container {
    height: calc(100vh - 200px);
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