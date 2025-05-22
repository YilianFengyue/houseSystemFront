<template>
  <v-card  class="my-5" rounded>
    <v-card-actions><v-card-title class="card-title text-h5">详细位置</v-card-title>
    <v-spacer></v-spacer>
    
    </v-card-actions>
    
    <v-divider></v-divider>
      <v-container fluid>
        <div ref="containerRef" style="width: 100%; height: 400px"></div>
        
      </v-container>
    </v-card>

  
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// 声明全局对象
declare global {
  interface Window {
    BMapGL: any
    onBMapCallback: () => void
  }
}

const props = defineProps<{ address: string }>()
const containerRef = ref<HTMLElement | null>(null)
let map: any

function loadBaiduMapScript(callback: () => void) {
  if (window.BMapGL) {
    callback()
    return
  }

  window.onBMapCallback = callback

  const script = document.createElement('script')
  script.src = 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=pHRGZ6xQ0bCAta2MAZifRrQkqBeQbtXk&callback=onBMapCallback'
  document.body.appendChild(script)
}

function initMap() {
  if (!containerRef.value) {
    console.error("地图容器未挂载")
    return
  }

  map = new window.BMapGL.Map(containerRef.value)
  map.enableScrollWheelZoom(true)

  const geocoder = new window.BMapGL.Geocoder()
  geocoder.getPoint(props.address, point => {
    if (point) {
      map.centerAndZoom(point, 15)
      map.addOverlay(new window.BMapGL.Marker(point))
    } else {
      console.error("地址解析失败")
    }
  })
}

onMounted(() => {
  loadBaiduMapScript(initMap)
})

watch(() => props.address, (newAddr) => {
  if (map && window.BMapGL) {
    const geocoder = new window.BMapGL.Geocoder()
    geocoder.getPoint(newAddr, point => {
      if (point) {
        map.centerAndZoom(point, 15)
        map.addOverlay(new window.BMapGL.Marker(point))
      }
    })
  }
})
</script>
