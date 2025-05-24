<template>
  <v-card
    v-if="fixCardStore.showFixCard"
    :color="color"
    :variant="variant"
    class="global-fix-card"
    :class="{ 'glass-effect': isGlassEffect }"
  >
    <v-card-item>
      <div class="pa-4">
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
            <!-- 新增房屋地址输入框 -->
            <v-text-field
              v-model="houseAddress"
              :rules="[v => !!v || '请输入房屋地址']"
              label="房屋地址"
              required
              variant="outlined"
              density="comfortable"
              class="mb-3"
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
            
            <v-select
              v-model="complaintPerson"
              :items="personItems"
              :rules="[v => !!v || '请选择投诉对象']"
              label="投诉对象"
              required
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :loading="isLoadingPersons"
              :disabled="isLoadingPersons"
              item-title="name"
              item-value="id"
            ></v-select>
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

          <div class="d-flex flex-column button-group">
            <v-btn
            color="success"
            variant="outlined"
            size="large"
            @click="submitForm"
            block
            class="mb-2"
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
              class="mb-2"
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
          </div>
        </v-form>
      </div>
    </v-card-item>
    <v-card-actions class="px-4 pb-3">
      <v-btn 
        @click="fixCardStore.toggleFixCard"
        variant="text"
        color="grey"
      >
        关闭
      </v-btn>
    </v-card-actions>

    <!-- 条款对话框 -->
    <v-dialog v-model="showTermsDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="headline">租房线上报修条款</v-card-title>
        <v-card-text>
          <RepairContract @terms-accepted="handleTermsAccepted"   @terms-rejected="showTermsDialog = false"/>
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
import { ref } from 'vue'
import { useFixCardStore } from '@/stores/fixCardStore'
import RepairContract from '@/components/RepaireContract.vue' // 根据实际路径调整

const isSubmitting = ref(false) // 添加加载状态


const fixCardStore = useFixCardStore()
const color = ref('indigo')
const variant = ref('tonal')
const isGlassEffect = ref(true)
const showTermsDialog = ref(false)

const form = ref()
const reportReason = ref(null)
const houseAddress = ref('')
const repairType = ref(null)
const repairItems = ['水电维修', '设备维修', '网络维修', '其他维修']
const otherRepairDescription = ref('')
const complaintContent = ref('')
const complaintPerson = ref(null)
// 新增的状态
const isLoadingPersons = ref(false)
const personItems = ref([]) // 替换原来的硬编码数组

// 新增的方法
async function fetchComplaintPersons() {
  isLoadingPersons.value = true
  try {
    const response = await fetch('http://localhost:5000/complaint-persons')
    if (!response.ok) {
      throw new Error('获取投诉对象列表失败')
    }
    const data = await response.json()
    personItems.value = data
  } catch (error) {
    console.error('获取投诉对象列表出错:', error)
  } finally {
    isLoadingPersons.value = false
  }
}

// 新增的生命周期钩子
onMounted(() => {
  fetchComplaintPersons()
})
const checkbox = ref(false)


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
      agreed_terms: checkbox.value
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
    reset() // 提交成功后重置表单
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

async function validate() {
  const { valid } = await form.value.validate()
  if (valid) {
    const data = {
      reportReason: reportReason.value,
      checkbox: checkbox.value
    }
    
    if (reportReason.value === 'repair') {
      data.houseAddress = houseAddress.value
      data.repairType = repairType.value
      if (repairType.value === '其他维修') {
        data.otherRepairDescription = otherRepairDescription.value
      }
    } else if (reportReason.value === 'complaint') {
      data.complaintContent = complaintContent.value
      data.complaintPerson = complaintPerson.value
    }
    
    alert('表单验证通过:\n' + JSON.stringify(data, null, 2))
  }
}

function reset() {
  form.value.reset()
  reportReason.value = null
  houseAddress.value = ''
  repairType.value = null
  otherRepairDescription.value = ''
  complaintContent.value = ''
  complaintPerson.value = null
}

function resetValidation() {
  form.value.resetValidation()
}
</script>

<style scoped>
.global-fix-card {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
  backdrop-filter: blur(8px);
}

.glass-effect {
  background-color: rgba(255, 255, 255, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.v-theme--dark .glass-effect {
  background-color: rgba(30, 30, 30, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-card-item {
  background-color: rgba(255, 255, 255, 0.6);
}

.v-theme--dark .v-card-item {
  background-color: rgba(0, 0, 0, 0.5);
}

.v-text-field,
.v-select,
.v-checkbox,
.v-btn,
.v-radio-group,
.v-textarea {
  background-color: transparent !important;
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