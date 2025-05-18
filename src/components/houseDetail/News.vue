<template>
  <v-carousel
    cycle
    height="400"
    hide-delimiter-background
    show-arrows-on-hover
  >
    <v-carousel-item
      v-for="(item, index) in newsList"
      :key="index"
    >
      <v-sheet
        height="100%"
        tile
        class="d-flex flex-column justify-center align-center"
        :style="{
          backgroundImage: `url(${item.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)'
        }"
      >
        <div
          class="text-center"
          style="color: white; max-width: 600px; padding: 0 20px;"
        >
          <h3 class="text-h5 font-weight-bold mb-2" style="text-shadow: 0 0 5px rgba(0,0,0,0.7);">
            {{ item.title }}
          </h3>
          <p style="text-shadow: 0 0 3px rgba(0,0,0,0.6); white-space: pre-line;">
            {{ item.content }}
          </p>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup lang="ts">
defineProps<{
  newsList: {
    title: string
    content: string
    bgImage: string
  }[]
}>()
</script>
