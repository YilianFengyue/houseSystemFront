<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const goToProduct = (catid: string) => {
  router.push({ path: "/product", query: { catid } });
};
const fetchArticles = async () => {
  try {
    const response = await axios.get("/sdApi/category");
    articles.value = response.data.data; // 假设返回的是数组
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};
const articles =ref<any[]>( [
  {
    id: 1,
    catid: "Birds",
    descn1:
      "https://ke-image.ljcdn.com/110000-inspection/dbe49773-02fa-4ec2-9433-a8cea4e65629_1000.jpg!m_fill,w_280,h_210,f_jpg?from=ke.com",
    name: "4/22/2022",
    productList: "1/13/2023",
    author: "afisbburne0",
    content:
      "is a modular Vue UI kit to build and prototype your projects faster. It features rich and responsive layouts and components, is built with Vue CLI on top of Vuetify, and is pre-loaded with support for Vuex and Vue Router. Comes with a Vue and a Nuxt starter template.",
  },
]);
// 组件挂载时执行
onMounted(fetchArticles);
</script>


<template>
  <v-toolbar class="mt-5" rounded="lg">
    <v-toolbar-title class="text-h6 font-weight-bold">
      <span>Category</span>
    </v-toolbar-title>
  </v-toolbar>

  <v-container width="1600">
    <v-row align="center">
      <v-col
        cols="12"
        xs="6"
        md="4"
        lg="4"
        xl="2
        "
        v-for="item in articles"
        :key="item.id"
      >
        <v-card max-width="400" class="mx-auto">
          <v-img cover :src="item.descn1" height="200px"></v-img>
          <v-card-title class="text-h6 font-weight-bold">
            {{ item.catid }}
          </v-card-title>
          <v-card-subtitle> Last Read At{{ item.productList }}</v-card-subtitle>
          <v-card-text>
            {{ item.name }}
          </v-card-text>
          <v-card-actions>
            <v-btn 
            @click="goToProduct(item.catid)"
            color="primary">
              <v-icon class="mr-2">mdi-more</v-icon>
              Learn More
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
