<script setup lang="ts">

// import TrackCard from "@/components/dashboard/TrackCard.vue";

//TestCard
import CategoryCard from "@/components/dashboard/CategoryCard.vue";
import BannerPage from "@/components/dashboard/BannerPage.vue";
import CardTest from "~/src/components/dashboard/CardTest.vue";
import Footer1 from "@/components/footer/Footer1.vue";
onMounted(() => {
  console.log("Dashboard mounted");
});

</script>
<template>
  <div class="pa-5">
     <!-- BannerPage############ -->
     <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <BannerPage></BannerPage>
      </v-col>
    </v-row>
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <CategoryCard></CategoryCard>
      </v-col>

    </v-row>
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <Footer1></Footer1>
      </v-col>

    </v-row>
  </div>
</template>
<style lang="scss" scoped></style>
