<template>
  <v-toolbar
    rounded="lg"
    border
    floating
    class="map-floating-toolbar" > 
    <v-text-field
      density="compact"
      placeholder="Search"
      prepend-inner-icon="mdi-magnify"
      variant="solo"
      class="mx-2 flex-grow-1" style="min-width: 180px;" flat
      hide-details
      single-line
      clearable 
    ></v-text-field>

    <template v-slot:append>
      <v-btn
        density="comfortable"
        icon="mdi-crosshairs-gps"
      ></v-btn>
      <v-btn
        class="ms-1" density="comfortable"
        icon="mdi-dots-vertical"
      ></v-btn>
    </template>
  </v-toolbar>
</template>

<style scoped>
.map-floating-toolbar {
  position: absolute; 
  top: 16px;          /* 距离顶部16px (可调整) */
  left: 50%;          /* 先将其左边缘移到父容器中心 */
  transform: translateX(-50%); /* 再将其自身向左移动50%的宽度，实现水平居中 */
  margin-top: 80px;
  
  width: clamp(300px, 60%, 500px); /* 最小300px，尝试占父容器60%，最大不超过500px */

  z-index: 10;       
  
 
}

/* 微调 v-text-field 在 toolbar 中的表现 */
.map-floating-toolbar .v-text-field {
  background-color: transparent !important; /* 如果 variant="solo" 导致了不想要的背景色 */
}
</style>