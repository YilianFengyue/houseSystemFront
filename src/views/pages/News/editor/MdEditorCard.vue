<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { MdPreview } from "md-editor-v3";

import "md-editor-v3/lib/preview.css";
const content = ref(`
<h2>Hi there,</h2>
<p>
this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there
are all kind of basic text styles you’d probably expect from a text
editor. But wait until you see the lists:
</p>
<ul>
<li>That’s a bullet list with one …</li>
<li>… or two list items.</li>
</ul>
<p>
Isn’t that great? And all of that is editable. But wait, there’s more.
Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
I know, I know, this is impressive. It’s only the tip of the iceberg
though. Give it a try and click a little bit around. Don’t forget to
check the other examples too.
</p>
<blockquote>
Wow, that’s amazing. Good work, boy! 👏
<br />
— Mom
</blockquote>
      `);


const emit = defineEmits(['submit']) // 定义事件

function handleSubmit() {
  emit('submit') // 通知父组件执行发布逻辑
}


</script>

<template>
  <div class="">
    
    <MdEditor v-model="content" />
    <v-color-picker width="100%" ></v-color-picker>
    <v-btn class="mt-2" block color="primary" @click="handleSubmit">发布！~</v-btn>
  </div>
</template>

<style scoped lang="scss"></style>
