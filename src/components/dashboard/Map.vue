<template>
    <div class="info">
      最新版GL地图命名空间为 BMapGL，可按住鼠标右键控制地图旋转、修改倾斜角度。
    </div>
    <div id="container"></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  
  // 动态加载百度地图 GL API 脚本
  function loadBMapGL() {
    return new Promise((resolve, reject) => {
      if (window.BMapGL) {
        return resolve(window.BMapGL)
      }
      const script = document.createElement('script')
      script.src = '//api.map.baidu.com/api?type=webgl&v=1.0&ak=pHRGZ6xQ0bCAta2MAZifRrQkqBeQbtXk'
      script.onload = () => resolve(window.BMapGL)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  
  onMounted(async () => {
    const BMapGL = await loadBMapGL()
    const map = new BMapGL.Map('container')
    map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12)
    map.enableScrollWheelZoom(true)
  })
  </script>
  
  <style>
  body,
  html,
  #container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: "微软雅黑";
  }
  .info {
    z-index: 999;
    width: auto;
    min-width: 22rem;
    padding: 0.75rem 1.25rem;
    margin-left: 1.25rem;
    position: fixed;
    top: 1rem;
    background-color: #fff;
    border-radius: 0.25rem;
    font-size: 14px;
    color: #666;
    box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  }
  </style>
  