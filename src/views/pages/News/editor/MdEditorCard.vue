<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { MdPreview } from "md-editor-v3";

import "md-editor-v3/lib/preview.css";

//Google reCAPTCHA
// 解决 window.grecaptcha 类型报错
declare global {
  interface Window {
    grecaptcha?: {
      getResponse: () => string;
      reset: () => void;
      // 其他方法如果需要可以继续添加
    };
  }
}
//谷歌验证码
const recaptchaSiteKey = '6LfRXlMrAAAAAIjs0Ln_JceX4X9l3DfVM5CNvjop' // 替换为你的 site key

const content = ref(`
<h2>Hi there,</h2>
<p>
this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there
are all kind of basic text styles you’d probably expect from a text


      `);


const emit = defineEmits(['submit']) // 定义事件

function handleSubmit() {
  emit('submit') // 通知父组件执行发布逻辑
}

const items = [
    { text: '注意发布时间', icon: 'mdi-clock' },
    { text: '记得及时保存', icon: 'mdi-flag' },
  ]
</script>

<template>
  <div class="">
    
    <MdEditor v-model="content" />
    <v-card
    class="mx-auto pa-2"
    max-width="300"
  >
    <v-list>
      <v-list-subheader>提示</v-list-subheader>

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
      
    </v-list>
  </v-card>
  <div style="max-width: 304px" class="my-4">
    <div class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
  </div>
    <v-btn class="mt-2" block color="primary" size="x-large" @click="handleSubmit">发布！~</v-btn>
  </div>
</template>

<style scoped lang="scss"></style>
