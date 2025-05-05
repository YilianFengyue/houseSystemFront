<script setup lang="ts">
import { onMounted,ref } from 'vue';
import * as live2d from 'live2d-render';

//实现live2d拖动
const route = useRoute();
const isDragging = ref(false);
let startX = 0, startY = 0;
let modelX = window.innerWidth - 300, modelY = window.innerHeight - 320; // 初始位置，适配窗口高度
//###################
const isRouterLoaded = computed(() => {
  if (route.name !== null) return true;
  return false;
});
//live2d消息
const message = ref("你好~");
const messageList = [
  "你好，是来找博士的吗？......完全不打扰哦，博士睡了，我只是在干吃他的泡面而已。要来一块吗？",
  "呀嚯~观众朋友你们好，我是你们的尤......呀！不对不对，罗德岛干员，U-Official，向博士报到！",
  "麦克风测试！大家能听见吗？",
  "博士，我下播啦。去甲板上转转吗？",
  "明日方舟。",
  "博士，经常在你的办公室里直播，给你添麻烦啦。"
];
onMounted(async () => {
  await live2d.initializeLive2D({
    BackgroundRGBA: [0.0, 0.0, 0.0, 0.0], // 背景颜色透明
    ResourcesPath: '/UG/ugofficial.model3.json', // model3.json 的路径
    CanvasSize: { height: 300, width: 300 }, // live2d 的大小
    ShowToolBox: true, // 展示工具箱
    LoadFromCache: true // 使用缓存优化
  });
  console.log('finish loading');
  live2d.setMessageBox(message.value, 3000);


  const live2dCanvas = document.querySelector('#live2d') as HTMLElement;
  if (live2dCanvas) {
    live2dCanvas.addEventListener("click", () => {
      const randomIndex = Math.floor(Math.random() * messageList.length);
      const randomMessage = messageList[randomIndex];
      live2d.setMessageBox(randomMessage, 3000);  // 显示随机消息
    });
    live2dCanvas.style.position = 'fixed';
    live2dCanvas.style.zIndex = '100';
    live2dCanvas.style.left = `${modelX}px`;
    live2dCanvas.style.top = `${modelY}px`;

    // **PC 端鼠标事件**
    live2dCanvas.addEventListener('mousedown', (event) => {
      isDragging.value = true;
      startX = event.clientX - modelX;
      startY = event.clientY - modelY;
    });

    // **移动端触摸事件**
    live2dCanvas.addEventListener('touchstart', (event) => {
      isDragging.value = true;
      const touch = event.touches[0]; // 获取第一根手指
      startX = touch.clientX - modelX;
      startY = touch.clientY - modelY;
    });

    const onMove = (x: number, y: number) => {
      if (!isDragging.value) return;
      requestAnimationFrame(() => {
        modelX = x - startX;
        modelY = y - startY;
        live2dCanvas.style.left = `${modelX}px`;
        live2dCanvas.style.top = `${modelY}px`;

        // **同步工具箱位置**
        const toolbox = document.querySelector('.__live2d-toolbox') as HTMLElement;
        if (toolbox) {
          toolbox.style.left = `${modelX + 300}px`;
          toolbox.style.top = `${modelY}px`;
        }
      });
    };

    // **PC 端鼠标移动**
    document.addEventListener('mousemove', (event) => {
      onMove(event.clientX, event.clientY);
    });

    // **移动端触摸移动**
    document.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      onMove(touch.clientX, touch.clientY);
      event.preventDefault(); // **防止页面滚动**
    });

    // **释放拖动**
    const onRelease = () => {
      isDragging.value = false;
    };
    document.addEventListener('mouseup', onRelease);
    document.addEventListener('touchend', onRelease);
  }
});
</script>

<template>
 <div id="live2d-container"></div> <!-- 添加容器用于渲染 live2d -->
</template>

<style lang="scss">
#live2dMessageBox-content {
    background-color: #FF95BC;
    color: white;
    font-family: var(--base-font);
    padding: 10px;
    height: fit-content;
    border-radius: .7em;
    word-break: break-all;
    border-right: 1px solid transparent;
}

.live2dMessageBox-content-hidden {
    opacity: 0;
    transform: scaleY(0.2);
    transition: all 0.35s ease-in;
    -moz-transition: all 0.35s ease-in;
    -webkit-transition: all 0.35s ease-in;
}

.live2dMessageBox-content-visible {
    opacity: 1;
    transition: all 0.35s ease-out;
    -moz-transition: all 0.35s ease-out;
    -webkit-transition: all 0.35s ease-out;
}

</style>

