<!--
* @Component: EchartPie
* @Maintainer: J.K. Yang
* @Description: Echart 饼图页
-->
\
<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, Ref } from "vue"; // 确保导入 watch
import type { EChartsOption } from "echarts";
import echarts, { useChart, RenderType, ThemeType } from "@/plugins/echarts"; // 引入 echarts 实例
import axios from "axios"; // 引入 axios

// 用于存储从后端获取的数据
const categoryData = ref<string[]>([]); // 对应 community_list
const seriesValueData = ref<number[]>([]); // 对应 num_list (用于柱状图和其中一个折线图的模拟)
const lineDataForSeries = ref<number[]>([]); // 模拟另一个折线图的数据 (因为原代码有两套 lineData/barData)

// 获取数据的函数
const fetchDataForColumnChart = async () => {
  try {
    const response = await axios.get("http://localhost:5000/houseinfo/columndata");
    if (response.data && response.data.success) {
      const backendData = response.data.data;
      categoryData.value = backendData.community_list.map((item: string | null) => item === null ? "未知小区" : item); // 处理 null 值
      seriesValueData.value = backendData.num_list;

      // 原代码中有两套数据 lineData 和 barData，这里我们用 num_list 作为基础
      // 你可以根据实际需求调整第二个系列的数据来源或生成方式
      // 为了简单，这里让 lineDataForSeries 是 seriesValueData 的一个简单变换
      lineDataForSeries.value = seriesValueData.value.map(val => Math.max(0, val + (Math.random() * 50 - 25))); // 稍微加点随机性

    } else {
      console.error("获取柱状图数据失败或后端报错:", response.data.message);
      categoryData.value = [];
      seriesValueData.value = [];
      lineDataForSeries.value = [];
    }
  } catch (error) {
    console.error("获取柱状图数据失败:", error);
    categoryData.value = [];
    seriesValueData.value = [];
    lineDataForSeries.value = [];
  }
};

const option = computed<EChartsOption>(() => ({
  backgroundColor: "#0f375f", // 你原来的背景色
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    data: ["房源数量", "趋势线", "背景条", "装饰点"], // 更新图例名称
    textStyle: {
      color: "#ccc",
    },
    padding: [30, 0, 0, 0],
  },
  grid: { // 添加 grid 配置，确保图表不会超出边界
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    data: categoryData.value, // 动态数据
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
    axisLabel: { // X轴标签样式
        interval: 0, // 显示所有标签
        rotate: 30,  // 旋转30度，防止重叠
        color: "#ccc"
    }
  },
  yAxis: {
    splitLine: { show: false },
    axisLine: {
      lineStyle: {
        color: "#ccc",
      },
    },
    axisLabel: { // Y轴标签样式
        color: "#ccc"
    }
  },
  series: [
    {
      name: "趋势线", // 对应原 'line' 系列
      type: "line",
      smooth: true,
      showAllSymbol: true,
      symbol: "emptyCircle",
      symbolSize: 10, // 稍微改小一点
      data: lineDataForSeries.value, // 动态数据
      itemStyle: { color: '#F5A623' }, // 给线条一个明确的颜色
      lineStyle: { color: '#F5A623' }
    },
    {
      name: "房源数量", // 对应原 'bar' 系列
      type: "bar",
      barWidth: 10,
      itemStyle: {
        borderRadius: 5,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#14c8d4" },
          { offset: 1, color: "#43eec6" },
        ]),
      },
      data: seriesValueData.value, // 动态数据
    },
    {
      name: "背景条", // 对应原 'line' (bar type) 系列，作为背景/装饰
      type: "bar",
      barGap: "-100%",
      barWidth: 10,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(20,200,212,0.5)" },
          { offset: 0.2, color: "rgba(20,200,212,0.2)" },
          { offset: 1, color: "rgba(20,200,212,0)" },
        ]),
      },
      z: -12,
      data: lineDataForSeries.value, // 使用与趋势线相同的数据或调整后的数据
    },
    {
      name: "装饰点", // 对应原 'dotted' 系列
      type: "pictorialBar",
      symbol: "rect",
      itemStyle: {
        color: "#0f375f", // 与背景色一致，或者稍作调整
      },
      symbolRepeat: true,
      symbolSize: [12, 4],
      symbolMargin: 1,
      z: -10,
      data: lineDataForSeries.value, // 使用与趋势线相同的数据或调整后的数据
    },
  ],
}));

const chartEl = ref<HTMLDivElement | null>(null);

const { setOption, showLoading: chartShowLoading, hideLoading: chartHideLoading } = useChart( // 修改了变量名以区分
  chartEl as Ref<HTMLDivElement>,
  true, // autoResize
  false, // 初始化时不立即 showLoading，我们在 fetchDataForColumnChart 中手动控制
  RenderType.SVGRenderer,
  ThemeType.Light // 你使用的是Light主题
);

onMounted(() => {
  // nextTick 不是必须的，如果 useChart 内部已经处理了
  chartShowLoading(); // 先显示loading
  fetchDataForColumnChart().finally(() => {
    chartHideLoading(); // 数据获取完毕（无论成功失败）后隐藏loading
    // setOption 依赖 watch option 的变化
  });
});

// 当 option (主要是其依赖 categoryData, seriesValueData, lineDataForSeries) 变化时，更新图表
watch(
  option,
  (newVal) => {
    if (chartEl.value) { // 确保图表已挂载
        setOption(newVal);
    }
  },
  { deep: true } // 确保深层数据变化能触发
);

</script>

<template>
  <v-card height="350" class="pa-2" rounded="md" color="transparent">
    <div ref="chartEl" :style="{ width: `100%`, height: `100%` }"></div>
  </v-card>
</template>