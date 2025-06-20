<template>
  <div class="…">
    <div v-if="status === 'success'">
      <h2 class="…">支付成功 🎉</h2>
      <p>订单号：{{ outTradeNo }}</p>
    </div>
    <div v-else-if="status === 'failure'">
      <h2 class="…">支付失败 ❌</h2>
      <p>请检查订单或联系客户客服。</p>
    </div>
    <div v-else>
      <p>正在校验支付结果…</p>
    </div>
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const status = ref<'pending' | 'success' | 'failure'>('pending')
const outTradeNo = ref<string>('')

onMounted(async () => {
   // 取出订单号（用于展示）
  const search = window.location.search   // e.g. "?out_trade_no=...&sign=...&..."
  const query = new URLSearchParams(search)
  outTradeNo.value = query.get('out_trade_no') || ''

  try {
    // 直接把完整查询字符串拼给后端
    const resp = await axios.get(`http://localhost:5000/api/alipay/verify_return${search}`)
    status.value = resp.data.status  // 应该是 "success" 或 "failure"
  } catch (err) {
    console.error('验签接口调用失败：', err)
    status.value = 'failure'
  }
})

function goHome() {
  router.push({ path: '/' })
}
</script>
