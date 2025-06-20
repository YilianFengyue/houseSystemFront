<template>
  <v-card
    v-if="fixCardStore.showFixCard"
    class="mx-auto my-8 global-fix-card"
    elevation="16"
    max-width="344"
  >
    <v-card-item>
      <v-card-title class="text-h5 font-weight-bold">
        {{ reportReason === 'repair' ? '维修申报' : '投诉提交' }}
      </v-card-title>
      <v-card-subtitle>
        {{ reportReason === 'repair' ? '请填写维修信息' : '请填写投诉内容' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-form ref="form" class="form-container">
        <!-- 申报原因单选栏 -->
        <v-radio-group
          v-model="reportReason"
          :rules="[v => !!v || '请选择申报原因']"
          label="申报原因"
          required
          class="mb-3"
        >
          <v-radio label="维修申报" value="repair"></v-radio>
          <v-radio label="投诉提交" value="complaint"></v-radio>
        </v-radio-group>

        <!-- 维修申报时的表单 -->
        <template v-if="reportReason === 'repair'">
          <!-- 房屋地址输入框（自动填充且只读） -->
          <v-text-field
            v-model="houseAddress"
            :rules="[v => !!v || '请输入房屋地址']"
            label="房屋地址"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            readonly
          ></v-text-field>
          
          <v-select
            v-model="repairType"
            :items="repairItems"
            :rules="[v => !!v || '请选择类型']"
            label="维修类型"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            @update:modelValue="handleRepairTypeChange"
          ></v-select>
          
          <!-- 其他维修时的描述输入框 -->
          <v-textarea
            v-if="repairType === '其他维修'"
            v-model="otherRepairDescription"
            :rules="[v => !!v || '请输入维修描述']"
            label="维修描述"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            rows="3"
          ></v-textarea>
        </template>

        <!-- 投诉提交时的表单 -->
        <template v-else-if="reportReason === 'complaint'">
          <v-textarea
            v-model="complaintContent"
            :rules="[v => !!v || '请输入投诉内容']"
            label="投诉内容"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            rows="3"
          ></v-textarea>
          
          <!-- 投诉对象选择（自动填充房东姓名） -->
          <v-text-field
            v-model="complaintPerson"
            :rules="[v => !!v || '请输入投诉对象']"
            label="投诉对象"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            readonly
          ></v-text-field>
        </template>

        <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || '必须同意才能继续']"
          required
          class="mb-4"
        >
          <template v-slot:label>
            <div>
              我已阅读并同意
              <a href="javascript:void(0)" @click.stop="showTermsDialog = true" class="terms-link">条款</a>
            </div>
          </template>
        </v-checkbox>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-4 pb-3">
      <div class="d-flex flex-column" style="width: 100%; gap: 8px;">
        <v-btn
          color="success"
          variant="outlined"
          size="large"
          @click="submitForm"
          block
          :loading="isSubmitting"
        >
          提交
        </v-btn>

        <v-btn
          color="error"
          variant="outlined"
          size="large"
          @click="reset"
          block
        >
          重置表单
        </v-btn>

        <v-btn
          color="warning"
          variant="outlined"
          size="large"
          @click="resetValidation"
          block
        >
          重置验证
        </v-btn>

        <v-btn 
          @click="closeDialog"
          variant="text"
          color="grey"
          block
        >
          关闭
        </v-btn>
      </div>
    </v-card-actions>

    <!-- 条款对话框 -->
    <v-dialog v-model="showTermsDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="headline">租房线上报修条款</v-card-title>
        <v-card-text>
          <RepairContract @terms-accepted="handleTermsAccepted" @terms-rejected="showTermsDialog = false"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showTermsDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useFixCardStore } from '@/stores/fixCardStore'
import RepairContract from '@/components/RepaireContract.vue'

const fixCardStore = useFixCardStore()
const isSubmitting = ref(false)
const showTermsDialog = ref(false)

const form = ref()
const reportReason = ref<'repair' | 'complaint' | null>(null)
const houseAddress = ref('')
const repairType = ref(null)
const repairItems = ['水电维修', '设备维修', '网络维修', '其他维修']
const otherRepairDescription = ref('')
const complaintContent = ref('')
const complaintPerson = ref('')
const checkbox = ref(false)

// 计算当前房源信息
const currentProperty = computed(() => fixCardStore.currentProperty)

// 监听弹窗显示状态变化，初始化表单数据
watch(
  () => fixCardStore.showFixCard,
  (isVisible) => {
    if (isVisible) {
      reset()
    } else {
      reset()
    }
  },
  { immediate: true }
)

// 监听当前房源变化，自动填充信息
watch(currentProperty, (newVal) => {
  if (newVal) {
    houseAddress.value = newVal.region // 使用region作为地址
    complaintPerson.value = newVal.landlord_username // 使用landlord_username作为投诉对象
  }
})

// 监听报修类型变化，同步更新表单类型
watch(
  () => fixCardStore.fixType,
  (newVal) => {
    nextTick(() => {
      reportReason.value = newVal === 'complain' ? 'complaint' : 'repair'
    })
  },
  { immediate: true }
)

function closeDialog() {
  fixCardStore.toggleFixCard()
  reset()
}

async function submitForm() {
  const { valid } = await form.value.validate()
  if (!valid) return
  
  isSubmitting.value = true
  
  try {
    const formData = {
      report_reason: reportReason.value,
      house_address: houseAddress.value,
      repair_type: repairType.value,
      repair_description: otherRepairDescription.value,
      complaint_content: complaintContent.value,
      complaint_person: complaintPerson.value,
      agreed_terms: checkbox.value,
      property_id: currentProperty.value?.id
    }
    
    const response = await fetch('http://localhost:5000/repaires', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      throw new Error('提交失败')
    }
    
    const result = await response.json()
    alert(`提交成功: ${result.message}`)
    closeDialog()
  } catch (error) {
    alert(`提交失败: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

function handleRepairTypeChange(value) {
  if (value !== '其他维修') {
    otherRepairDescription.value = ''
  }
}

function handleTermsAccepted() {
  checkbox.value = true
  showTermsDialog.value = false
}

function reset() {
  form.value?.reset()
  reportReason.value = fixCardStore.fixType === 'complain' ? 'complaint' : 'repair'
  repairType.value = null
  otherRepairDescription.value = ''
  complaintContent.value = ''
  checkbox.value = false
  
  if (currentProperty.value) {
    houseAddress.value = currentProperty.value.region // 使用region作为地址
    complaintPerson.value = currentProperty.value.landlord_username // 使用landlord_username作为投诉对象
  }
}

function resetValidation() {
  form.value?.resetValidation()
}
</script>

<style scoped>
.global-fix-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.terms-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
}

.terms-link:hover {
  color: #0d47a1;
}
</style>