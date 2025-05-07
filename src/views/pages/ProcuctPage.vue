<script setup lang="ts">
import HouseCard1 from "~/src/components/houseDetail/HouseCard1.vue";
import { onMounted } from "vue";

onMounted(() => {
  console.log("Dashboard mounted");
});
</script>

<template>
  <div class="pa-5">
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <HouseCard1 />
      </v-col>
    </v-row>
  </div>
</template>
