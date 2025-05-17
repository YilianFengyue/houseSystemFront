import { ref } from 'vue'
import { useSnackbarStore } from "@/stores/snackbarStore";

const snackbarStore = useSnackbarStore();

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// WebSocket连接
let socket: WebSocket | null = null;
const isConnected = ref(false);

// 初始化WebSocket连接
export const initWebSocket = (token: string, onMessage: (data: any) => void) => {
  const wsUrl = import.meta.env.VITE_WS_URL || `ws://localhost:3000/ws`;
  socket = new WebSocket(`${wsUrl}?token=${token}`);
  
  socket.onopen = () => {
    isConnected.value = true;
    console.log('WebSocket connected');
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('WebSocket message parse error:', error);
    }
  };
  
  socket.onclose = () => {
    isConnected.value = false;
    console.log('WebSocket disconnected');
    snackbarStore.showWarningMessage('连接已断开，正在尝试重连...');
    setTimeout(() => initWebSocket(token, onMessage), 5000); // 5秒后重连
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    snackbarStore.showErrorMessage('聊天室连接错误');
  };
};

// 发送WebSocket消息
export const sendWebSocketMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      ...message,
      timestamp: Date.now()
    }));
  } else {
    console.error('WebSocket is not connected');
    snackbarStore.showErrorMessage('消息发送失败，连接已断开');
  }
};

// 关闭WebSocket连接
export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
    isConnected.value = false;
  }
};

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
  username: string;
  type: string;
}

// 获取历史消息
export const fetchHistoryMessages = async (channel_id: string, token: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${channel_id}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching history messages:', error);
    snackbarStore.showErrorMessage('获取历史消息失败');
    return [];
  }
};

// 获取在线用户列表
export const fetchOnlineUsers = async (channel_id: string, token: string): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${channel_id}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching online users:', error);
    snackbarStore.showErrorMessage('获取在线用户失败');
    return [];
  }
};

export { isConnected };