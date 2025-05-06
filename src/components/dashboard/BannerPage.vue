<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top:420, behavior: "smooth" });
};
//SearchBar
import SearchBar from "~/src/components/dashboard/SearchBar.vue";
</script>

<template>
  <v-card class="my-5" rounded>
   
    <v-card-title class="card-title">Main</v-card-title>
    <v-divider></v-divider>
    <v-parallax src="/public/images/house.jpg" height="600" class="mb-5">
      <div class="text-center pa-10">
      <img class="mx-auto" width="200" src="@/assets/logo2.png" alt="" />
      <v-card
        color="transparent"
        elevation="0"
        max-width="800"
        class="mx-auto my-10 py-0py-md-12"
      >
        <h1
          style="color: #4a4d6d"
          class="font-weight-black text-h3 text-lg-h2 text-xl-h1  font-family: 'Noto Sans SC Bold', sans-serif"
        >
          要找真房源 还是贝壳全
          
        </h1>
       
      </v-card>
      <v-card
        color="transparent"
        elevation="0"
        max-width="600"
        class="mx-auto my-10 py-0py-md-12"
      >
      <div class="text-center mb-10" >
        <search-bar></search-bar>
        <v-btn size="x-large" class="text-white" color="primary" @click="scrollToTop"
          >Get Start</v-btn
        >
      </div>
      </v-card>
      
    </div>
    </v-parallax>
   
  </v-card>
</template>

<style scoped lang="scss"></style>
