<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow">
    <h2 class="text-2xl font-semibold mb-4">订单支付（演示用假数据）</h2>

    <div class="space-y-4">
      <div>
        <label class="block mb-1">订单号</label>
        <input
          v-model="outTradeNo"
          type="text"
          class="w-full border rounded px-2 py-1"
          placeholder="例如：FAKE123456"
        />
      </div>
      <div>
        <label class="block mb-1">支付金额 (元)</label>
        <input
          v-model.number="totalAmount"
          type="number"
          step="0.01"
          class="w-full border rounded px-2 py-1"
          placeholder="例如：0.01"
        />
      </div>
      <div>
        <label class="block mb-1">商品名称（可选）</label>
        <input
          v-model="subject"
          type="text"
          class="w-full border rounded px-2 py-1"
          placeholder="默认：订单"
        />
      </div>
    </div>

    <button
      class="mt-6 w-full py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
      :disabled="isLoading"
      @click="handlePay"
    >
      {{ isLoading ? '正在跳转...' : '去支付宝支付（假数据演示）' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'

// 演示用假数据
const outTradeNo = ref<string>('FAKE123464')
const totalAmount = ref<number>(0.01)
const subject = ref<string>('测试商品')
const isLoading = ref(false)

async function handlePay() {
  // 直接使用已经有的假数据，无需二次校验
  isLoading.value = true
  try {
    const resp = await axios.post('http://localhost:5000/api/alipay/pay', {
      out_trade_no: outTradeNo.value,
      total_amount: totalAmount.value.toFixed(2),
      subject: subject.value,
    })
    const payUrl = resp.data.data.pay_url
    window.location.href = payUrl
  } catch (err: any) {
    console.error(err)
    alert('发起支付失败，请稍后重试')
    isLoading.value = false
  }
}
</script>

