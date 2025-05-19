<template>
  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="1032"
  >
    <v-card-item>
      <v-card-title>
        签约协议
      </v-card-title>

      <v-card-subtitle>
        请您仔细阅读并同意以下协议，若您不同意，请勿填写内容。
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p>出租方（以下简称甲方）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>身份证号（代表人）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>联系电话：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>

        <p>承租方（以下简称乙方）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>身份证号（代表人）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>联系电话：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>

        <p>根据《中华人民共和国民法典》及相关法律法规的规定，甲乙双方在平等、自愿、公平、诚实信用的基础上，就乙方租赁甲方房屋事宜达成如下协议：</p>

        <p><strong>一、房屋基本情况</strong></p>
        <p>甲方将位于______________________，建筑面积约______平方米的房屋出租给乙方使用。</p>
        <p>房屋内现有设施设备情况（可另附清单）：</p>

        <p><strong>二、房屋用途</strong></p>
        <p>该房屋用途为 {{ purpose || '______' }}。未经甲方书面同意，乙方不得擅自改变房屋用途。</p>

            <v-radio-group 
                v-model="purpose"
                label="请选择房屋用途"
                class="mt-4"
                >
                <v-radio
                    label="居住"
                    value="居住"
                    color="primary"
                ></v-radio>
                <v-radio
                    label="办公"
                    value="办公"
                    color="primary"
                ></v-radio>
                <v-radio
                    label="仓储"
                    value="仓储"
                    color="primary"
                ></v-radio>
                </v-radio-group>

        <p>乙方保证在租赁期间内，按照约定用途合理使用房屋，不得利用房屋从事违法违规活动。</p>

        <p><strong>三、租赁期限</strong></p>
        
           <p>租赁期限自 {{ formattedStartDate || '______' }} 起至 {{ formattedEndDate || '______' }} 止。</p>

                <!-- 开始日期选择器 -->
                <v-text-field
                v-if="!showStartPicker"
                :model-value="formattedStartDate || '请选择开始日期'"
                readonly
                @click="showStartPicker = true"
                class="mt-4 date-input"
                ></v-text-field>
                <v-date-picker
                v-else
                v-model="startDate"
                label="选择开始日期"
                type="date"
                @update:model-value="handleStartDateChange"
                class="mt-4"
                ></v-date-picker>

                <!-- 结束日期选择器 -->
                <v-text-field
                v-if="!showEndPicker"
                :model-value="formattedEndDate || '请选择结束日期'"
                readonly
                @click="showEndPicker = true"
                class="mt-4 date-input"
                ></v-text-field>
                <v-date-picker
                v-else
                v-model="endDate"
                label="选择结束日期"
                type="date"
                @update:model-value="handleEndDateChange"
                class="mt-4"
                ></v-date-picker>


        <p>租赁期满，甲方有权收回房屋，乙方应如期交还。乙方如要求续租，则必须在租赁期满 [提前续租告知时间，应在 30 日前] 前通知甲方，经甲方同意后重新签订租赁合同。在同等条件下，乙方享有优先续租权。</p>

        <p><strong>四、租金及押金</strong></p>
        <p>该房屋月租金为人民币{{ rentValue || '______' }}元整（大写：{{ formatCurrency(rentValue) || '______' }}元整）。</p>
        <p>乙方向甲方缴纳租房押金人民币______元整（大写：______元整），租赁期满或合同解除后，扣除应由乙方承担的费用，押金应无息退还给乙方。</p>

        <p><strong>五、付款方式</strong></p>
        <p>乙方可通过以下方式向甲方支付租金及押金：</p>
        <p>银行转账：甲方指定银行账户信息如下：</p>
        <p>开户银行：__________________</p>
        <p>账户名称：__________________</p>
        <p>账号：__________________</p>
        <p>电子支付：甲方接受的电子支付方式为 ：微信、支付宝、银联等。</p>

        <p><strong>六、房屋交付及使用</strong></p>
        <p>甲方应于____年__月__日将房屋交付给乙方，并与乙方共同对房屋及附属设施设备进行验收，填写《房屋及设施设备验收清单》，双方签字确认。</p>
        <p>乙方应合理使用并爱护房屋及其附属设施设备，不得故意损坏。如因乙方原因造成房屋及设施设备损坏或灭失的，乙方应负责修复或赔偿。</p>

        <p><strong>七、维修及保养责任</strong></p>
        <p>租赁期间，甲方负责房屋主体结构及附属设施设备的正常维修，确保乙方的正常使用。但因乙方使用不当或人为造成的损坏，由乙方负责维修及费用。</p>
        <p>乙方应合理使用水、电、气等设施，如因乙方使用不当导致的安全事故或损失，由乙方承担全部责任。</p>
        <p>房屋日常的清洁、保养等费用由乙方承担。</p>

        <p><strong>八、装修及改造约定</strong></p>
        <p>乙方如需对房屋进行装修或改造，必须事先征得甲方的书面同意，并向相关部门办理必要的审批手续。装修或改造费用由乙方自行承担。</p>
        <p>租赁期满或合同解除后，乙方对房屋的装修及改造不得拆除（可移动部分除外），应无偿归甲方所有。</p>

        <p><strong>九、房屋相关费用承担</strong></p>
        <p>在房屋租赁期间，水、电、气、物业管理费、有线电视费、网络费等费用由乙方承担，并按照相关部门规定的时间和方式按时缴纳。若因乙方未按时缴纳导致的停水、停电等后果及损失，由乙方自行承担。</p>
        <p>如发生政府有关部门征收本合同未列出项目但与使用该房屋有关的费用，均由乙方支付（法律法规另有规定的除外）。</p>

        <p><strong>十、合同的解除</strong></p>
        <p>经甲乙双方协商一致，可以提前解除本合同。</p>
        <p>因不可抗力导致本合同无法继续履行的，本合同自行解除。</p>
        <p>乙方有下列情形之一的，甲方有权单方解除合同，并要求乙方赔偿因此给甲方造成的损失：</p>
        <p>擅自改变房屋用途的；</p>
        <p>擅自将房屋转租给第三人的；</p>
        <p>拖欠租金累计达 [X] 日的；</p>
        <p>损坏房屋及其附属设施设备，经甲方多次要求仍未修复或赔偿的；</p>
        <p>利用房屋从事违法违规活动的。</p>

        <p><strong>十一、违约责任</strong></p>
        <p>甲乙双方应严格履行本合同约定。如一方违约，应向对方承担违约责任，并赔偿因此给对方造成的损失。</p>
        <p>甲方未按照约定时间交付房屋或交付的房屋不符合合同约定的，应按照租金的 [X%] 向乙方支付违约金，并承担乙方因此遭受的损失。</p>
        <p>乙方未按照约定时间支付租金的，每逾期一日，应按照未付租金的 [X%] 向甲方支付滞纳金；逾期超过 [X] 日的，甲方有权解除合同，并没收押金。</p>
        <p>如因不可抗力导致合同无法履行或造成损失的，双方互不承担责任，但应及时通知对方并提供相关证明。</p>

        <p><strong>十二、争议解决方式</strong></p>
        <p>本合同在履行过程中发生的争议，由双方协商解决；协商不成的，任何一方均有权向房屋所在地有管辖权的人民法院提起诉讼。</p>

        <p><strong>十三、其他条款</strong></p>
        <p>本合同未尽事宜，可由双方协商补充，补充协议与本合同具有同等法律效力。补充协议内容与本合同不一致的，以补充协议为准。</p>
        <p>本合同一式两份，甲乙双方各执一份，自双方签字（或盖章）之日起生效。</p>

        <p>甲方（签字 / 盖章）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>日期：{{ currentDate }}</p>

        <p>乙方（签字 / 盖章）：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>日期：{{ currentDate }}</p>
    </v-card-text>


     <v-card-actions>
      <v-btn 
        color="primary" 
        block 
        size="large"
        @click="submitContract"
        :loading="isSubmitting"
      >
        提交合同
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// 表单数据
const formData = ref({
  rentValue: '',
  purpose: '',
  startDate: '',
  endDate: '',
  landlordName: '',
  landlordId: '',
  landlordPhone: '',
  tenantName: '',
  tenantId: '',
  tenantPhone: ''
})

const isSubmitting = ref(false)

// 提交合同数据
const submitContract = async () => {
  try {
    isSubmitting.value = true
    
    // 准备完整的数据对象
    const payload = {
      rentValue: rentValue.value,
      purpose: purpose.value,
      startDate: startDate.value,
      endDate: endDate.value,
      landlordName: formData.value.landlordName || '', // 确保包含所有必填字段
      landlordId: formData.value.landlordId || '',
      landlordPhone: formData.value.landlordPhone || '',
      tenantName: formData.value.tenantName || '',
      tenantId: formData.value.tenantId || '',
      tenantPhone: formData.value.tenantPhone || '',
      formattedRent: formatCurrency(rentValue.value),
      currentDate: new Date().toISOString().split('T')[0]
    }

    const response = await fetch('http://localhost:5000/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json() // 获取后端返回的错误详情
      throw new Error(errorData.message || '提交失败')
    }

    const result = await response.json()
    console.log('提交成功:', result)
    alert('合同提交成功！')
    
  } catch (error) {
    console.error('提交错误:', error)
    alert(`提交失败: ${error.message}`) // 显示具体错误信息
  } finally {
    isSubmitting.value = false
  }
}

const route = useRoute()
const rentValue = ref('') // 租金数据

// 从路由参数获取租金
onMounted(() => {
  rentValue.value = route.query.rent?.toString() || ''
})

// 数字转中文大写
const formatCurrency = (numStr: string) => {
  if (!numStr) return ''
  const num = parseFloat(numStr)
  if (isNaN(num)) return ''
  
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿']
  let result = ''
  
  const numStrArr = Math.floor(num).toString().split('').reverse()
  
  numStrArr.forEach((n, i) => {
    result = digits[parseInt(n)] + units[i] + result
  })
  
  return result + '元整'
}


// 获取当前日期
const currentDate = new Date().toISOString().split('T')[0];

const startDate = ref(null);
const endDate = ref(null);
const showStartPicker = ref(false);
const showEndPicker = ref(false);
const purpose = ref(null);

// 格式化日期为 xxxx-xx-xx
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 计算属性确保显示格式
const formattedStartDate = computed(() => formatDate(startDate.value));
const formattedEndDate = computed(() => formatDate(endDate.value));

// 处理日期选择事件
const handleStartDateChange = (date) => {
  startDate.value = date;
  showStartPicker.value = false;
};

const handleEndDateChange = (date) => {
  endDate.value = date;
  showEndPicker.value = false;
};
</script>

<style scoped>
.date-input {
  cursor: pointer;
}
.date-input:hover {
  background-color: #f5f5f5;
}
/* 可选样式：增加单选框组与文本的间距 */
.v-radio-group {
  margin-top: 16px;
}
/* 单选项间距调整 */
.v-radio {
  margin-bottom: 8px;
}
</style>