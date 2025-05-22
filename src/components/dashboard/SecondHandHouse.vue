<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";

//路由跳转
import { useRouter } from 'vue-router'
const router = useRouter()
function goHouseDetail() {
  router.push(`/house`)
}
function goHouseDetail1(id: number) {
  router.push(`/house/${id}`)
}
import axios from "axios";
const houses =ref<any[]>( [
  
  {
    landlord: "孙女士",
    page_views: "560",
    image_url: "https://i.pinimg.com/736x/78/a9/6f/78a96f0de5b473b12bcd5be63f5891df.jpg",
    title: "整租·润和湘江天地 1室1厅 南",
    community: "润和湘江天地",
    price: "1500"
  },
]);
const fetchHouces = async () => {
  try {
    const response = await axios.get("/sdApi/houseinfo/hotLists");
    houses.value = response.data.data; // 假设返回的是数组
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};
onMounted(fetchHouces);
</script>

<template>
  <v-toolbar class="mt-5" rounded="lg">
    <v-toolbar-title class="text-h6 font-weight-bold">
      <span>热门房源</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn 
    color="primary"
    @click="goHouseDetail()">
        <v-icon class="mr-2">mdi-more</v-icon>
        Learn More
    </v-btn>
  </v-toolbar>

  <v-container fluid>
    <v-row align="center">
      <v-col
        cols="12"
        xs="6"
        md="4"
        lg="3"
        xl="2
        "
        v-for="item in houses"
        :key="item.id"
      >
        <v-card max-width="400" class="mx-auto">
          <v-img cover :src="item.image_url" height="200px"></v-img>
          <v-card-title class="text-h6 font-weight-bold">
            {{ item.title }} 
          </v-card-title>
          <v-card-subtitle>{{ item.community }}
            
          </v-card-subtitle>
          <v-card-text class=" d-flex text-red font-weight-bold justify-space-between">
                总价：{{ item.price }}
                <v-chip color="green">
                  {{ item.page_views }} 浏览
                </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">
              <v-icon class="mr-2">mdi-account</v-icon>
              {{ item.landlord }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :href="item.href" target="_blank"
            @click="goHouseDetail1(item.id)"
            >
              查看详情
              <v-icon class="ml-2">mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
