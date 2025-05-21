<template>
  <!-- 主对话框 -->
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="onDialogUpdate"
    max-width="700"
    persistent
  >
    <v-card>
      <v-card-title class="headline">{{ editIndex !== null ? '编辑房源' : '新增房源' }}</v-card-title>

      <!-- 步骤条 -->
      <div class="stepper-header" style="display: flex; justify-content: space-between; margin: 20px 0 10px;">
        <div
          v-for="step in 3"
          :key="step"
          :style="{
            flex: 1,
            padding: '12px 0',
            textAlign: 'center',
            color: activeStep === step ? '#1976d2' : '#666',
            fontWeight: activeStep === step ? '700' : '400',
            borderBottom: activeStep === step ? '3px solid #1976d2' : '1px solid #ccc',
            cursor: 'default',
            userSelect: 'none'
          }"
        >
          {{ stepLabels[step - 1] }}
        </div>
      </div>

      <!-- 步骤内容 -->
      <div style="padding: 0 24px 24px;">
        <!-- 第1步 -->
        <div v-show="activeStep === 1">
          <v-form ref="formRef1" lazy-validation>
            <v-text-field v-model="localForm.house_num" label="房源编号" :rules="[v => !!v || '请输入房源编号']" required dense />
            <v-text-field v-model="localForm.title" label="标题" :rules="[v => !!v || '请输入标题']" required dense />
            <v-text-field v-model="localForm.region" label="区" :rules="[v => !!v || '请输入所在区']" required dense />
            <v-text-field v-model="localForm.block" label="街道" :rules="[v => !!v || '请输入街道']" required dense />
            <v-text-field v-model="localForm.community" label="小区" :rules="[v => !!v || '请输入小区名']" required dense />
            <v-text-field
              v-model.number="localForm.area"
              label="面积（㎡）"
              type="number"
              dense
              :rules="[v => (v === null || v === '' || v >= 0) || '面积不能小于0']"
              min="0"
            />
            <v-text-field v-model="localForm.direction" label="朝向" dense />
          </v-form>
        </div>

        <!-- 第2步 -->
        <div v-show="activeStep === 2">
          <v-form ref="formRef2" lazy-validation>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localForm.rooms" label="户型" dense clearable />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="localForm.price"
                  label="价格（元/月）"
                  :rules="[v => v > 0 || '请输入价格']"
                  type="number"
                  required
                  dense
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="localForm.rent_type"
                  :items="['整租', '合租']"
                  label="租赁方式"
                  :rules="[v => !!v || '请选择租赁方式']"
                  required
                  dense
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localForm.decoration" label="装修情况" dense clearable />
              </v-col>

              <v-col cols="12">
                <v-row class="custom-switch-group" align="center" style="gap: 32px;">
                  <v-switch
                    v-model="localForm.subway"
                    label="地铁附近"
                    :true-value="'1'"
                    :false-value="'0'"
                    dense
                    :class="{'custom-switch': true, 'switch-active': localForm.subway === '1'}"
                  />
                  <v-switch
                    v-model="localForm.available"
                    label="是否随时看房"
                    :true-value="1"
                    :false-value="0"
                    dense
                    :class="{'custom-switch': true, 'switch-active': localForm.available === 1}"
                  />
                  <v-switch
                    v-model="localForm.tag_new"
                    label="是否新上"
                    :true-value="1"
                    :false-value="0"
                    dense
                    :class="{'custom-switch': true, 'switch-active': localForm.tag_new === 1}"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </div>

        <!-- 第3步 -->
        <div v-show="activeStep === 3">
          <v-form ref="formRef3" lazy-validation>
            <v-text-field v-model="localForm.landlord" label="房东" dense />
            <v-text-field v-model="localForm.phone_num" label="房东电话" dense />
            <v-text-field
              v-model.number="localForm.page_views"
              label="浏览量"
              type="number"
              dense
              :rules="[v => (v === null || v === '' || v >= 0) || '浏览量不能小于0']"
              min="0"
            />
            <v-file-input
              v-model="localForm.photos"
              label="上传房源图片"
              multiple
              show-size
              accept="image/*"
              dense
            />
          </v-form>
        </div>
      </div>

      <!-- 按钮 -->
      <v-card-actions style="justify-content: space-between; padding: 0 24px 24px;">
        <v-btn text :disabled="activeStep === 1" @click="activeStep--">上一步</v-btn>
        <div>
          <v-btn text color="error" @click="resetAll">刷新</v-btn>
          <v-btn text @click="cancel">取消</v-btn>
          <v-btn text color="primary" @click="saveCurrent">保存</v-btn>
          <v-btn color="primary" v-if="activeStep < 3" @click="nextStep">下一步</v-btn>
          <v-btn color="success" v-else @click="submitFinal">完成提交</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 确认对话框 -->
  <v-dialog v-model="confirmDialog" max-width="420">
  <v-card>
    <!-- 顶部图标 + 标题 -->
    <v-card-title class="d-flex align-center">
      <v-icon color="warning" class="mr-2">mdi-alert-circle</v-icon>
      <span class="text-h6 font-weight-medium">{{ confirmTitle || '确认操作' }}</span>
    </v-card-title>

    <v-divider></v-divider>

    <!-- 内容文本 -->
    <v-card-text class="py-5 px-6 text-body-1 text-medium-emphasis" style="white-space: pre-line;">
      {{ confirmMessage }}
    </v-card-text>

    <!-- 操作按钮 -->
    <v-card-actions class="justify-end px-6 pb-4">
      <v-btn variant="text" @click="handleConfirmResult(false)">取消</v-btn>
      <v-btn color="primary" variant="elevated" @click="handleConfirmResult(true)">确定</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  <!-- Snackbar 提示 -->
  <v-snackbar v-model="snackbar" :timeout="2500">{{ snackbarMessage }}</v-snackbar>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  formData: Object,
  editIndex: [Number, null]
})

const emit = defineEmits(['update:modelValue', 'save'])

const stepLabels = ['基本信息', '租赁详情', '上传图片']
const activeStep = ref(1)

const confirmDialog = ref(false)
const confirmMessage = ref('')
let confirmResolve = null

const snackbar = ref(false)
const snackbarMessage = ref('')

const emptyFormTemplate = {
  house_num: '',
  title: '',
  region: '',
  block: '',
  community: '',
  area: null,
  direction: '',
  rooms: '',
  price: null,
  rent_type: '',
  decoration: '',
  subway: '0',
  available: 1,
  tag_new: 0,
  landlord: '',
  phone_num: '',
  photos: [],
  publish_time: null,
  page_views: null
}

const savedForm = reactive(JSON.parse(JSON.stringify(emptyFormTemplate)))
const localForm = reactive(JSON.parse(JSON.stringify(emptyFormTemplate)))

watch(() => props.modelValue, (val) => {
  if (val) {
    Object.assign(localForm, JSON.parse(JSON.stringify(savedForm)))
    activeStep.value = 1
  }
})

watch(() => props.formData, (val) => {
  if (val) {
    Object.assign(savedForm, JSON.parse(JSON.stringify(val)))
    Object.assign(localForm, JSON.parse(JSON.stringify(val)))
  }
}, { immediate: true })

function onDialogUpdate(val) {
  if (!val) Object.assign(localForm, JSON.parse(JSON.stringify(savedForm)))
  emit('update:modelValue', val)
}

function showConfirm(message) {
  confirmMessage.value = message
  confirmDialog.value = true
  return new Promise((resolve) => {
    confirmResolve = resolve
  })
}

function handleConfirmResult(result) {
  confirmDialog.value = false
  confirmResolve?.(result)
  confirmResolve = null
}

async function nextStep() {
  if (activeStep.value === 1 &&
      (!localForm.house_num || !localForm.title || !localForm.region || !localForm.block || !localForm.community || localForm.area === null || localForm.area === '')
  ) {
    const proceed = await showConfirm('基本信息未填完整，是否确认跳转下一步？')
    if (!proceed) return
  }
  if (activeStep.value === 2 &&
      (!localForm.price || !localForm.rent_type)
  ) {
    const proceed = await showConfirm('租赁详情未填完整，是否确认跳转下一步？')
    if (!proceed) return
  }
  if (activeStep.value < 3) activeStep.value++
}

function saveCurrent() {
  Object.assign(savedForm, JSON.parse(JSON.stringify(localForm)))
  snackbarMessage.value = '已保存当前内容'
  snackbar.value = true
}

function cancel() {
  emit('update:modelValue', false)
}

async function resetAll() {
  const proceed = await showConfirm('确定要刷新重置所有内容吗？')
  if (proceed) {
    Object.assign(localForm, JSON.parse(JSON.stringify(emptyFormTemplate)))
    activeStep.value = 1
  }
}

function submitFinal() {
  if (!localForm.house_num || !localForm.title || !localForm.region || !localForm.block || !localForm.community) {
    snackbarMessage.value = '请先填写完整基本信息'
    snackbar.value = true
    activeStep.value = 1
    return
  }
  if (!localForm.price || !localForm.rent_type) {
    snackbarMessage.value = '请先填写完整租赁详情'
    snackbar.value = true
    activeStep.value = 2
    return
  }
  emit('save', { form: JSON.parse(JSON.stringify(localForm)), index: props.editIndex })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.custom-switch {
  --v-switch-base-color: #999;
  --v-switch-checked-color: #1976d2;
}
.custom-switch .v-switch-thumb {
  background-color: #999;
  transition: background-color 0.3s;
}
.switch-active {
  --v-switch-base-color: #1976d2 !important;
  --v-switch-checked-color: #1976d2 !important;
}
.switch-active .v-switch-thumb {
  background-color: #1976d2 !important;
}
</style>
