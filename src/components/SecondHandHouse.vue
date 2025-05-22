<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
const houses =ref<any[]>( [
  
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
