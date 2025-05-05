<script setup lang="ts">
import ProductCard from "@/components/dashboard/ProductCard.vue";
import CategoryCard from "@/components/dashboard/CategoryCard.vue";
import { onMounted } from "vue";

onMounted(() => {
  console.log("Dashboard mounted");
});
</script>

<template>
  <div class="pa-5">
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <ProductCard />
      </v-col>
    </v-row>
  </div>
</template>
