<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">房屋租赁平台</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text to="/">首页</v-btn>
        <v-btn text to="/listings">房源列表</v-btn>
        <v-btn text to="/about">关于我们</v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-btn text to="/login" class="d-none d-md-flex">
        <v-icon left>mdi-login</v-icon>
        登录
      </v-btn>
      <v-btn to="/register" color="white" class="ml-2 black--text d-none d-md-flex">
        <v-icon left>mdi-account-plus</v-icon>
        注册
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" temporary class="d-md-none">
      <v-list nav dense>
        <v-list-item prepend-icon="mdi-home" title="首页" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-format-list-bulleted" title="房源列表" to="/listings"></v-list-item>
        <v-list-item prepend-icon="mdi-information" title="关于我们" to="/about"></v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-login" title="登录" to="/login"></v-list-item>
        <v-list-item prepend-icon="mdi-account-plus" title="注册" to="/register"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-0">
        <v-img
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
          gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          height="60vh"
          cover
          class="d-flex align-center justify-center text-center"
        >
          <v-responsive class="mx-auto" max-width="800">
            <h1 class="text-h3 text-sm-h2 text-md-h1 font-weight-bold mb-6 text-white">
              发现您的理想之家
            </h1>
            <p class="text-h6 text-sm-h5 mb-8 text-white opacit-80">
              轻松搜索、比较并租赁最适合您的房源
            </p>
            <v-sheet
              color="rgba(255, 255, 255, 0.9)"
              class="pa-6 pa-md-8 rounded-lg"
              elevation="4"
            >
              <v-row align="center" justify="center">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="searchLocation"
                    label="输入区域、街道或小区开始搜索"
                    variant="solo"
                    prepend-inner-icon="mdi-map-marker"
                    hide-details
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="searchType"
                    :items="['公寓', '别墅', '合租', '整租']"
                    label="房屋类型"
                    variant="solo"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn color="primary" block size="x-large" @click="performSearch">
                    <v-icon left>mdi-magnify</v-icon>
                    搜索房源
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-responsive>
        </v-img>
      </v-container>

      <v-container class="my-12">
        <h2 class="text-h4 font-weight-bold mb-2 text-center">特色房源</h2>
        <p class="text-body-1 text-grey-darken-1 mb-8 text-center">
          我们为您精心挑选的优质房源
        </p>
        <v-row>
          <v-col
            v-for="listing in featuredListings"
            :key="listing.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card hover>
              <v-img :src="listing.image" height="200px" cover></v-img>
              <v-card-item>
                <v-card-title class="text-h6">{{ listing.title }}</v-card-title>
                <v-card-subtitle class="d-flex align-center my-1">
                  <v-icon color="orange" icon="mdi-map-marker" size="small" class="mr-1"></v-icon>
                  {{ listing.location }}
                </v-card-subtitle>
              </v-card-item>
              <v-card-text>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-primary font-weight-bold text-h6">¥{{ listing.price }}/月</span>
                  <v-chip color="secondary" label small>{{ listing.type }}</v-chip>
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  {{ listing.bedrooms }}室 {{ listing.livingrooms }}厅 | {{ listing.area }}m² | {{ listing.facing }}
                </div>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-btn color="primary" text block @click="viewListing(listing.id)">
                  查看详情
                  
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center" class="mt-8">
          <v-btn color="primary" size="large" to="/listings">
            浏览更多房源
            <v-icon right>mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <v-container fluid class="bg-grey-lighten-4 py-16">
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h2 class="text-h4 font-weight-bold mb-4">准备好出租您的房产了吗？</h2>
              <p class="text-body-1 text-grey-darken-1 mb-8">
                加入我们，轻松管理您的房源，接触数千名潜在租户。
              </p>
              <v-btn color="accent" size="x-large" to="/post-listing">
                <v-icon left>mdi-home-plus</v-icon>
                免费发布房源
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <v-footer app class="bg-grey-darken-3 text-white" padless>
        <v-container>
          <v-row align="center" class="py-4">
            <v-col cols="12" md="6" class="text-center text-md-left">
              &copy; {{ new Date().getFullYear() }} 房屋租赁平台. 保留所有权利.
            </v-col>
            <v-col cols="12" md="6" class="text-center text-md-right">
              <v-btn icon class="mx-1" href="#" target="_blank">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon class="mx-1" href="#" target="_blank">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon class="mx-1" href="#" target="_blank">
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
              <v-btn icon class="mx-1" href="#" target="_blank">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script setup>
//图标


import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 如果你需要编程式导航

const drawer = ref(false);
const searchLocation = ref('');
const searchType = ref(null);

const router = useRouter(); // 获取 router 实例

// 示例特色房源数据
const featuredListings = ref([
  {
    id: 1,
    title: '市中心精装公寓',
    location: '市中心, 人民广场',
    price: 3500,
    type: '公寓',
    bedrooms: 2,
    livingrooms: 1,
    area: 75,
    facing: '南',
    image: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', // 替换为真实图片链接
  },
  {
    id: 2,
    title: '近地铁舒适单间',
    location: '浦东新区, 张江高科',
    price: 1800,
    type: '合租',
    bedrooms: 1,
    livingrooms: 1,
    area: 20,
    facing: '东',
    image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', // 替换为真实图片链接
  },
  {
    id: 3,
    title: '豪华江景大平层',
    location: '黄浦区, 外滩',
    price: 12000,
    type: '整租',
    bedrooms: 4,
    livingrooms: 2,
    area: 220,
    facing: '东南',
    image: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', // 替换为真实图片链接
  },
  {
    id: 4,
    title: '温馨两居室带阳台',
    location: '徐汇区, 漕河泾',
    price: 4500,
    type: '整租',
    bedrooms: 2,
    livingrooms: 1,
    area: 88,
    facing: '南',
    image: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', // 替换为真实图片链接
  },
]);

const performSearch = () => {
  // 实现搜索逻辑，例如跳转到搜索结果页并带上查询参数
  console.log('搜索地点:', searchLocation.value);
  console.log('房屋类型:', searchType.value);
  if (router) {
    router.push({
      path: '/listings',
      query: { location: searchLocation.value, type: searchType.value }
    });
  }
};

const viewListing = (id) => {
  // 跳转到房源详情页
  console.log('查看房源详情:', id);
  if (router) {
    router.push(`/listing/${id}`);
  }
};
</script>

<style scoped>
/* 你可以在这里添加一些自定义样式 */
.opacit-80 {
  opacity: 0.8;
}
/* 确保页脚在内容不足时也能固定在底部 */
/* 如果使用 v-footer app 属性，通常不需要额外处理，但以防万一 */
/*
  v-app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  v-main {
    flex-grow: 1;
  }
*/
</style>