<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
const houses =ref<any[]>( [
  {
    href: "https://cs.ke.com/ershoufang/104111945340.html",
    image: "https://ke-image.ljcdn.com/110000-inspection/pc1_jVO8uvmCE.jpg!m_fill,w_265,h_205,f_jpg?from=ke.com",
    title: "岳麓·桐梓坡 - 西岸润泽府",
    info: "4室2厅·140.24平米",
    price: "136.8万"
  },
  {
    href: "https://cs.ke.com/ershoufang/104116028320.html",
    image: "https://ke-image.ljcdn.com/110000-inspection/3ada91e9-1f32-486e-90df-fcb03a0914aa_1000.jpg!m_fill,w_265,h_205,f_jpg?from=ke.com",
    title: "岳麓·岳麓其他 - 华润置地润樾府",
    info: "4室2厅·142平米",
    price: "189万"
  },
  {
    href: "https://cs.ke.com/ershoufang/104115851982.html",
    image: "https://ke-image.ljcdn.com/110000-inspection/pc1_O4hlma8G2.jpg!m_fill,w_265,h_205,f_jpg?from=ke.com",
    title: "岳麓·滨江新城 - 卓越中寰",
    info: "4室2厅·142.34平米",
    price: "252万"
  },
  {
    href: "https://cs.ke.com/ershoufang/104114973458.html",
    image: "https://ke-image.ljcdn.com/110000-inspection/1005aff7-ebfa-4367-96fc-f8afb0dc7522_1000.jpg!m_fill,w_265,h_205,f_jpg",
    title: "岳麓·岳麓其他 - 华润置地润樾府",
    info: "3室2厅·114.54平米",
    price: "141.6万"
  }
]);
</script>

<template>
  <v-toolbar class="mt-5" rounded="lg">
    <v-toolbar-title class="text-h6 font-weight-bold">
      <span>二手好房</span>
    </v-toolbar-title>
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
          <v-img cover :src="item.image" height="200px"></v-img>
          <v-card-title class="text-h6 font-weight-bold">
            {{ item.title }}
          </v-card-title>
          <v-card-subtitle> Last Read At{{ item.lastReadAt }}</v-card-subtitle>
          <v-card-text class="text-red font-weight-bold">
           总价：{{ item.price }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">
              <v-icon class="mr-2">mdi-account</v-icon>
              {{ item.author }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :href="item.href" target="_blank">
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
