<template>
    <v-form>
      <v-container >
        <v-row >
          <v-col cols="12">
            <v-text-field
            
              v-model="message"
              :append-icon="message ? 'mdi-send' : 'mdi-microphone'"
              :append-inner-icon="marker ? 'mdi-map-marker' : 'mdi-map-marker-off'"
              :prepend-icon="icon"
              clear-icon="mdi-close-circle"
              label="请输入区域开始找房~"
              type="text"
              variant="solo"
              clearable
              @click:append="sendMessage"
              @click:append-inner="toggleMarker"
              @click:clear="clearMessage"
              @click:prepend="changeIcon"
            ></v-text-field>
            
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </template>

  <script setup lang="ts">
    import { computed, ref } from 'vue'
  
    const icons = [
      'mdi-emoticon',
      'mdi-emoticon-cool',
      'mdi-emoticon-dead',
      'mdi-emoticon-excited',
      'mdi-emoticon-happy',
      'mdi-emoticon-neutral',
      'mdi-emoticon-sad',
      'mdi-emoticon-tongue',
    ]
  
    const message = ref('')
    const marker = ref(true)
    const iconIndex = ref(0)
  
    const icon = computed(() => {
      return icons[iconIndex.value]
    })
    function toggleMarker () {
      marker.value = !marker.value
    }
  
    function sendMessage () {
      resetIcon()
      clearMessage()
    }
    function clearMessage () {
      message.value = ''
    }
    function resetIcon () {
      iconIndex.value = 0
    }
    function changeIcon () {
      iconIndex.value === icons.length - 1
        ? iconIndex.value = 0
        : iconIndex.value++
    }
  </script>