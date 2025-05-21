<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import contractmod from "@/components/contractmod.vue";
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Top Toolbar -->
  <!-- ---------------------------------------------- -->
  <v-toolbar rounded="lg" height="100" color="primary">
    <div class="ml-5">
      <h3 class="text-h5 font-weight-bold">
        签约协议
        <v-chip size="small" class="ma-2"> details below </v-chip>
      </h3>
    </div>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-toolbar>
  
  <div>
   <contractmod></contractmod>
  
  </div>

</template>

<style lang="scss"></style>
