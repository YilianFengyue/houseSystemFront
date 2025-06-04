<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description: 通知栏组件，显示用户收到的消息
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useProfileStore } from "@/stores/profileStore";
import { useRouter } from 'vue-router'; // 新增：引入路由

const profileStore = useProfileStore();
const username = profileStore.user.name;
const router = useRouter(); // 新增：初始化路由

// 定义消息类型
interface Message {
  message_id: number;
  content: string;
  sender_username: string;
  receiver_username: string;
  timestamp: string;
  channel_id: number;
}

// 转换后的消息类型，用于前端显示
interface DisplayMessage {
  title: string;
  color: string;
  icon: string;
  subtitle: string;
  time: string;
  originalMessage: Message; // 新增：存储原始消息
}

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const messages = ref<DisplayMessage[]>([]);
const unreadCount = ref(0);
const loading = ref(false);
const error = ref(null);

// 统一图标和颜色
const colorMap = ['primary']; // 统一为primary
const iconMap = ['mdi-account-circle']; // 统一为mdi-account-circle

// 获取消息
const fetchMessages = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await axios.get(`http://localhost:5000/comments/messages/receiver/${username}`);
    
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.messages)
    ) {
      messages.value = response.data.data.messages.map((msg: Message) => ({
        title: `来自 ${msg.sender_username} 的消息`,
        color: colorMap[0], // 使用统一颜色
        icon: iconMap[0], // 使用统一图标
        subtitle: msg.content,
        time: formatTime(msg.timestamp),
        originalMessage: msg // 存储原始消息
      }));
      
      unreadCount.value = messages.value.length;
    } else {
      console.warn('接收到的消息数据结构不符合预期:', response.data);
      messages.value = [];
      unreadCount.value = 0;
    }
  } catch (err) {
    error.value = err;
    console.error('获取消息失败:', err);
  } finally {
    loading.value = false;
  }
};

// 格式化时间显示
const formatTime = (timestamp: string) => {
  const now = new Date();
  const msgTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - msgTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '刚刚';
  if (diffInMinutes < 60) return `${diffInMinutes} 分钟前`;
  if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)} 小时前`;
  return `${Math.floor(diffInMinutes / (60 * 24))} 天前`;
};

// 组件挂载时获取消息
onMounted(() => {
  fetchMessages();
});

// 点击消息时的处理
const handleMessageClick = (message: DisplayMessage) => {
  // 标记消息为已读
  router.push({
    path: '/chat',
    query: { landlord: message.originalMessage.sender_username } // 传递发送者用户名
  });
  
  // 更新未读计数
  unreadCount.value = Math.max(0, unreadCount.value - 1);
};

// 关闭菜单
const closeMenu = () => {
  // 使用refs获取v-menu并关闭
  const menu = defineExpose({
    closeMenu: () => {
      // 实际实现需要根据Vuetify的API调整
      // 例如：menuRef.value.close()
    }
  });
};
</script>

<template>
  <v-menu location="bottom right" transition="slide-y-transition">
    <!-- Activator Btn -->
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" class="text-none">
        <v-badge :content="unreadCount" color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
    </template>
    
    <v-list elevation="1" lines="three" density="compact" width="400">
      <v-list-subheader class="font-weight-bold pl-2" >消息列表</v-list-subheader>
      
      <template v-if="loading">
        <v-list-item>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-list-item>
      </template>
      
      <template v-else-if="error">
        <v-list-item>
          <v-alert type="error">加载消息失败</v-alert>
        </v-list-item>
      </template>
      
      <template v-else-if="messages.length === 0">
        <v-list-item>
          <v-list-item-title class="font-weight-bold pl-2 d-flex justify-center">暂无消息</v-list-item-title>
        </v-list-item>
      </template>
      
      <template v-else>
        <v-list-item 
          v-for="(message, i) in messages" 
          :key="message.originalMessage.message_id" 
          @click="handleMessageClick(message)"
        >
          <!-- Prepend -->
          <template v-slot:prepend>
            <v-avatar size="40" :color="message.color">
              <v-icon color="white">{{ message.icon }}</v-icon>
            </v-avatar>
          </template>
          
          <!-- Append -->
          <template v-slot:append>
            <div class="full-h d-flex align-center">
              <span class="text-body-2 text-grey">{{ message.time }}</span>
            </div>
          </template>
          
          <!-- Main Content -->
          <div>
            <v-list-item-title class="font-weight-bold text-primary">
              {{ message.title }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ message.subtitle }}</v-list-item-subtitle>
          </div>
        </v-list-item>
      </template>
      
      <!-- Close Btn -->
      <div class="text-center py-5">
        <v-btn 
          prepend-icon="mdi-close"
          variant="outlined"
          elevation="4"
          @click="closeMenu"
          color="red-darken-4"
        >
          关闭
        </v-btn>
      </div>
    </v-list>
  </v-menu>
</template>

<style scoped lang="scss">
// ::v-deep .v-list-item__append,
// ::v-deep .v-list-item__prepend {
//   height: 100%;
// }
</style>  