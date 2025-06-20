<!--
* @Component: EchartPie
* @Maintainer: J.K. Yang
* @Description: Echart 饼图页
-->

<script setup lang="ts">
import axios from "axios";
import { Ref } from "vue";
import type { EChartsOption } from "echarts";
import { useChart, RenderType, ThemeType } from "@/plugins/echarts";
import { useTheme } from "vuetify";
const { current } = useTheme();
const dataSet = ref([
  { value: 8, name: "3室2厅" },
  { value: 7, name: "1室1厅" },
  { value: 4, name: "4室2厅" },
  { value: 3, name: "2室2厅" },
  { value: 2, name: "1室0厅1卫" },
]);
const fetchdataSets = async () => {
  try {
    const response = await axios.get("http://localhost:5000/houseinfo/piedata");
    dataSet.value = response.data.data; // 假设返回的是数组
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};
const option = computed<EChartsOption>(() => ({
  // ...chart option
  backgroundColor: current.value.colors.surface,

  tooltip: {
    trigger: "item",
  },
  //数值需要动态调整
  visualMap: {
    show: false,
    min: 0,
    max: 20,
    inRange: {
      colorLightness: [0, 1],
    },
  },
  series: [
    {
      name: "房源户型分布",
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      data: dataSet.value,
      roseType: "radius",
      label: {
        color: "rgba(255, 255, 255, 0.3)",
      },
      labelLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
        smooth: 0.2,
        length: 10,
        length2: 20,
      },
      itemStyle: {
        color: "#03a9f4",
        shadowBlur: 100,
        shadowColor: "rgba(0, 0, 0, 0.2)",
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: function (idx) {
        return Math.random() * 200;
      },
    },
  ],
}));

const chartEl = ref<HTMLDivElement | null>(null);

const { setOption, showLoading } = useChart(
  chartEl as Ref<HTMLDivElement>,
  true,
  true,
  RenderType.SVGRenderer,
  ThemeType.Dark
);

onMounted(() => {
  nextTick(() => {
    // 显示loading
    showLoading();
    // 假装有网络请求 ...
    fetchdataSets();
    // 渲染图表
    setOption(option.value);
  });
});

watch(
  () => option.value,
  (newVal) => {
    setOption(newVal);
  },
  { deep: true }
);
</script>

<template>
  <v-card color="transparent" height="360">
    <div ref="chartEl" :style="{ width: `100%`, height: `100%` }"></div>
  </v-card>
</template>
