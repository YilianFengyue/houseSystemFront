<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { img2imgApi } from "@/api/stableDiffusionApi";
import { useStableDiffusionStore } from "@/stores/stableDiffusionStore";
import { submitImagine } from "@/api/midJourneyApi";
const token = "sk-peE5Ux1D4w9lahUYB71c145bD2874226Ae7eF696B3De1930"; // 请替换成你自己的 token


const sdStore = useStableDiffusionStore();
const params = reactive({
  seed: -1,
  enable_hr: false,
  height: 200,
  negative_prompt: "",
  prompt: "1cat",
  width: 200,
  steps: 20,
});
const loading = ref(false);
//taskId
const taskId = ref<string | null>(null);  // 保存任务 ID
// 轮询任务状态，假设有接口可以获取任务的生成进度和结果
import axios from "axios";
// 轮询任务状态
const imageUrl = ref<string | null>(null); // 保存返回的图片地址
const pollTaskResult = async (taskId: string) => {
  try {
    const interval = setInterval(async () => {
      const res = await axios.get(`https://api.gpt.ge/mj/task/${taskId}/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("已发送");
      if (res.data.status === "SUCCESS") {
        clearInterval(interval);  // 停止轮询
        imageUrl.value = res.data.imageUrl;  // 获取图片 URL 并赋值
        console.log("任务完成，图片已生成", res.data.imageUrl);
        sdStore.updateImgUrl(imageUrl);    // 存储到 store 中
        loading.value = false;
      } else if (res.data.status === "FAILURE") {
        clearInterval(interval);  // 停止轮询
        console.error("任务失败", res.data.failReason);
        loading.value = false;
      }
    }, 5000); // 每 5 秒查询一次任务状态
  } catch (err) {
    console.error("查询任务状态失败", err);
  }
};



const imageGenerate = async () => {
  try {
    loading.value = true;
    const res = await submitImagine(
      {
        prompt: params.prompt,
        botType: "MID_JOURNEY",
      },
      token
    );
     // 保存任务 ID，后续轮询时需要用到
    taskId.value = res.data.result;
    console.log("任务已提交", res.data);
    // 启动轮询任务
    await pollTaskResult(taskId.value);
  } catch (err) {
    console.error("提交失败：", err);
  }
};
</script>

<template>
  <v-card height="800">
    <v-card-text>
      <!-- ---------------------------------------------- -->
      <!-- Prompt  -->
      <!-- ---------------------------------------------- -->
      <v-label class="font-weight-medium my-3">Prompt</v-label>
      <v-textarea
        v-model="params.prompt"
        color="primary"
        variant="outlined"
        density="compact"
        type="text"
        placeholder="Prompt"
        hide-details
      />

      <!-- ---------------------------------------------- -->
      <!-- Negative Prompt  -->
      <!-- ---------------------------------------------- -->
      <v-label class="font-weight-medium my-3">Negative Prompt</v-label>
      <v-textarea
        v-model="params.negative_prompt"
        color="primary"
        variant="outlined"
        density="compact"
        type="text"
        placeholder="Negative Prompt"
        hide-details
      />

      <!-- ---------------------------------------------- -->
      <!-- Width   -->
      <!-- ---------------------------------------------- -->
      <v-label class="font-weight-medium my-3">Width</v-label>
      <v-slider
        v-model="params.width"
        thumb-label="always"
        max="2480"
        step="10"
        color="primary"
      ></v-slider>
      <!-- ---------------------------------------------- -->
      <!-- Height   -->
      <!-- ---------------------------------------------- -->
      <v-label class="font-weight-medium my-3">Height</v-label>
      <v-slider
        v-model="params.height"
        thumb-label="always"
        max="2480"
        step="10"
        color="primary"
      ></v-slider>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
      />
      <v-btn size="x-large" color="primary" block @click="imageGenerate"
        >Generate</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
