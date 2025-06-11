<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->

<script setup lang="ts">
import { useProfileStore } from "@/stores/profileStore";
import { Icon } from "@iconify/vue";
import { ref, computed } from 'vue';
import { formatIdCard } from '@/utils/formatIdCard';
import { useRouter } from 'vue-router';
import axios from 'axios'; // 引入 axios

const profileStore = useProfileStore();
// 相关信息
const newpassword = ref("");
const confirmPassword = ref("");
// 使用 storeToRefs 包裹 store 实例，然后再解构
const user = reactive({ ...profileStore.user });
const account = reactive({ ...profileStore.account });
const signon = reactive({ ...profileStore.signon });
const authorized = reactive({
  google: false,
  facebook: false,
});

const notifications = reactive({
  officialEmails: false,
  followerUpdates: false,
});

const passwords = reactive({
  currentPassword: "123456",
  newPassword: "",
  confirmPassword: "",
});

const currentPasswordShow = ref(false);
const newPasswordShow = ref(false);
const confirmPasswordShow = ref(false);

onMounted(() => {
  console.log("user", user);
  console.log("userStore", profileStore.user.addr);
});

const router = useRouter();
const navigateToRent = () => {
  router.push({
    path: '/RentHouse'
  });
};

// 身份证隐秘
const rawIdCard = ref(user.identityCard || ''); // 存储原始值（无脱敏）
const isEditingIdCard = ref(false); // 标记是否正在编辑

const formattedIdCard = computed({
  get: () => {
    if (!rawIdCard.value) return '';
    
    // 正在编辑时，显示原始值（不脱敏）
    if (isEditingIdCard.value) {
      return rawIdCard.value;
    }
    
    // 非编辑状态：脱敏显示（前3 + 12* + 后3）
    const len = rawIdCard.value.length;
    if (len <= 6) {
      return rawIdCard.value; // 不足6位不脱敏
    }
    const prefix = rawIdCard.value.substring(0, 3);
    const suffix = rawIdCard.value.substring(Math.max(len - 3, 3));
    return `${prefix}${'*'.repeat(len - 6)}${suffix}`;
  },
  set: (newValue) => {
    // 用户输入时，存储原始值（移除空格和*）
    const cleanedValue = newValue.replace(/[\s*]/g, '');
    rawIdCard.value = cleanedValue;
    user.identityCard = cleanedValue;
  }
});

// 监听输入框焦点状态
const onIdCardFocus = () => {
  isEditingIdCard.value = true; // 聚焦时显示原始值
};
const onIdCardBlur = () => {
  isEditingIdCard.value = false; // 失焦时恢复脱敏，脱敏即如 510***********123
};

// 添加修改密码的方法
const updatePassword = async () => {
  if (newpassword.value !== confirmPassword.value) {
    snackbar.color = 'error';
    snackbar.message = '两次输入的密码不一致，请重新输入！';
    snackbar.show = true;
    return;
  }

  const id = profileStore.getUserId(); // 获取用户 ID

  try {
    const response = await axios.put('http://localhost:5000/user/userinfo/password', {
      id, // 添加 id 参数
      name: user.name,
      password: newpassword.value
    });

    if (response.data.code === 200) {
      snackbar.color = 'success';
      snackbar.message = '密码更新成功';
      snackbar.show = true;
      newpassword.value = '';
      confirmPassword.value = '';
      showPasswordMismatch.value = false;
    } else {
      snackbar.color = 'error';
      snackbar.message = response.data.message;
      snackbar.show = true;
    }
  } catch (error) {
    console.error('更新密码时出错:', error);
    snackbar.color = 'error';
    snackbar.message = '服务器内部错误，请稍后再试';
    snackbar.show = true;
  }
};

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

const showPasswordMismatch = ref(false);

const checkPasswordMatch = () => {
  if (newpassword.value && confirmPassword.value) {
    showPasswordMismatch.value = newpassword.value !== confirmPassword.value;
  } else {
    showPasswordMismatch.value = false;
  }
};


// 添加更新用户信息的方法
const updateUserInfo = async () => {
  const id = profileStore.getUserId(); // 获取用户 ID

  try {
    const response = await axios.put('http://localhost:5000/user/userinfo', {
      id, // 添加 id 参数
      name: user.name,
      addr: user.addr,
      email: user.email,
      phone: user.phone,
      identityCard: user.identityCard
    });

    if (response.data.code === 200) {
      snackbar.color = 'success';
      snackbar.message = '用户信息更新成功';
      snackbar.show = true;
      // 更新本地存储的用户信息
      profileStore.setUser(response.data.data);
    } else {
      snackbar.color = 'error';
      snackbar.message = response.data.message;
      snackbar.show = true;
    }
  } catch (error) {
    console.error('更新用户信息时出错:', error);
    snackbar.color = 'error';
    snackbar.message = '服务器内部错误，请稍后再试';
    snackbar.show = true;
  }
};

const userType = ref(profileStore.user.userType);


//邮箱部分
// 邮箱验证
//用于申请房东身份
// 邮箱验证码相关状态
const emailVerificationCode = ref('');
const isSendingCode = ref(false);
const countdown = ref(60);
const verificationError = ref('');
const isSubmitting = ref(false);

// 发送邮箱验证码
const sendEmailVerificationCode = async () => {
  if (!user.email) {
    verificationError.value = '邮箱地址不能为空';
    return;
  }
  
  try {
    isSendingCode.value = true;
    verificationError.value = '';
    
    // 调用API发送邮箱验证码
    const response = await axios.post('http://localhost:5000/user/userinfo/tolanlord', {
      email: user.email,
      //type: 'landlord_application' // 可以指定验证码类型
    });
    
    if (response.data.code === 200) {
      // 开始倒计时
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          isSendingCode.value = false;
          countdown.value = 60;
        }
      }, 1000);
      
      snackbar.color = 'success';
      snackbar.message = '验证码已发送至您的邮箱，请查收';
      snackbar.show = true;
    } else {
      verificationError.value = response.data.message || '验证码发送失败';
      isSendingCode.value = false;
    }
  } catch (error) {
    console.error('发送邮箱验证码出错:', error);
    verificationError.value = '服务器错误，请稍后再试';
    isSendingCode.value = false;
  }
};

// 提交房东申请
const submitLandlordApplication = async () => {
  if (!emailVerificationCode.value) {
    verificationError.value = '请输入邮箱验证码';
    return;
  }
  
  try {
    isSubmitting.value = true;
    verificationError.value = '';
    
    const response = await axios.put('http://localhost:5000/user/userinfo/usertype', {
      //userId: profileStore.getUserId(),
      email: user.email,
      //code: emailVerificationCode.value
    });
    
    if (response.data.code === 200) {
      snackbar.color = 'success';
      snackbar.message = '申请已提交，请重新登陆以获取状态';
      snackbar.show = true;
      // 更新用户类型状态
      userType.value = 2; // 假设2表示已申请待审核状态
    } else {
      verificationError.value = response.data.message || '申请提交失败';
    }
  } catch (error) {
    console.error('提交申请出错:', error);
    verificationError.value = '服务器错误，请稍后再试';
  } finally {
    isSubmitting.value = false;
  }
};



</script>

<template>
  <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">

    <!-- 添加Snackbar通知 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>

    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <div class="d-flex flex-column pa-10">
            <v-avatar size="120" class="mx-auto elevation-12" color="white">
              <v-img :src="user.avatarUrl"> </v-img>
            </v-avatar>

            <div class="text-center mt-5">
              <h3 class="text-h6 font-weight-bold">
                {{user.name}}
                <v-chip size="small" class="font-weight-bold" color="blue">
                  User
                </v-chip>
              </h3>
              <p class="text-body-2">Costumer of Petstore</p>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-map-marker </v-icon>
            <span class="ml-4">{{ account.city }}</span>
          </div>

          <v-divider></v-divider>
          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-email-check-outline </v-icon>
            <span class="ml-4">{{user.email }}</span>
          </div>
          <v-divider></v-divider>

          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-phone-outline </v-icon>
            <span class="ml-4">{{user.phone}}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <!-- ---------------------------------------------- -->
        <!--   Basic Infomation -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            基本信息
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="5">
                <v-label class="font-weight-medium mb-2">用户名</v-label>
                <v-text-field
                  v-model="user.name"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="你的名字"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-label class="font-weight-medium mb-2">地址</v-label>
                <v-text-field
                  v-model="user.addr"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="请输入您的地址"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="5">
                <v-label class="font-weight-medium mb-2">邮箱</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  v-model="user.email"
                  color="White"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="请填写邮箱"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-label class="font-weight-medium mb-2">电话</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  v-model="user.phone"
                  color="White"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="请填写电话"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="5">
                <v-label class="font-weight-medium mb-2">身份证号</v-label>
                  <v-text-field
                    v-model="formattedIdCard"
                    @focus="onIdCardFocus"
                    @blur="onIdCardBlur"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    type="text"
                    placeholder="请输入18位身份证号"
                    :maxlength="18"
                    @input="e => formattedIdCard = e.replace(/[^\d]/g, '')"
                  />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
              @click="navigateToRent"
            >
              我的房源
            </v-btn>
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
              @click="updateUserInfo"
            >
              基本信息修改
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Authentication  -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            Authentication
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" md="6">
                <v-btn
                  size="large"
                  block
                  variant="outlined"
                  disabled
                >
                  <Icon
                    icon="logos:google-icon"
                    class="mr-3 my-2"
                  />Google
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon
                    icon="logos:facebook"
                    class="mr-3 my-2"
                  />Facebook
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn size="large" block variant="elevated"
                  color="primary"
                >
                  <Icon
                    icon="logos:github-icon"
                    class="mr-3 my-2"
                  />Github
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon icon="logos:twitter" class="mr-3 my-2" />Twitter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Change Password  -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            修改密码
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">当前密码</v-label>
                <v-text-field
                  readonly
                  v-model="signon.password"
                  class="bg-blue-grey-lighten-5"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  :type="currentPasswordShow ? 'text' : 'password'"
                  placeholder="Current Password"
                  hide-details
                  :append-inner-icon="
                    currentPasswordShow ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="
                    currentPasswordShow = !currentPasswordShow
                  "
                />
              </v-col>
              <v-col cols="12" sm="6"> </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">新密码</v-label>
                <v-text-field
                  v-model="newpassword"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  :type="newPasswordShow ? 'text' : 'password'"
                  placeholder="new password"
                  hide-details
                  :append-inner-icon="
                    newPasswordShow ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="newPasswordShow = !newPasswordShow"
                  @input="checkPasswordMatch"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">再次输入密码</v-label>
                <v-text-field
                  v-model="confirmPassword"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  :type="confirmPasswordShow ? 'text' : 'password'"
                  placeholder="confirm password"
                  hide-details
                  :append-inner-icon="
                    confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="
                    confirmPasswordShow = !confirmPasswordShow
                  "
                  @input="checkPasswordMatch"
                />
                <v-alert
                  v-if="showPasswordMismatch"
                  type="error"
                  density="compact"
                  class="mt-2"
                >
                  两次输入的密码不一致
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
              @click="updatePassword"
              :disabled="showPasswordMismatch"
            >
              修改密码
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Notifications  -->
        <!-- ---------------------------------------------- -->
        
        <v-card class="mb-5" v-if="userType === 1">
  <v-card-title class="py-4 font-weight-bold">
    申请成为房东
  </v-card-title>
  <v-divider></v-divider>
  <v-card-text class="pa-7">
    <v-row>
      <v-col cols="12" sm="8">
        <v-label class="font-weight-medium mb-2">邮箱地址</v-label>
        <v-text-field
          v-model="user.email"
          color="primary"
          variant="outlined"
          density="compact"
          type="email"
          placeholder="请输入您的邮箱"
          hide-details
          readonly
        />
      </v-col>
      <v-col cols="12" sm="4" class="d-flex align-end">
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="isSendingCode"
          @click="sendEmailVerificationCode"
        >
          {{ isSendingCode ? `${countdown}秒后重试` : '获取验证码' }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col cols="12" sm="8">
        <v-label class="font-weight-medium mb-2">邮箱验证码</v-label>
        <v-text-field
          v-model="emailVerificationCode"
          color="primary"
          variant="outlined"
          density="compact"
          type="text"
          placeholder="请输入邮箱验证码"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col cols="12">
        <v-alert
          v-if="verificationError"
          type="error"
          density="compact"
          class="mt-2"
        >
          {{ verificationError }}
        </v-alert>
      </v-col>
    </v-row>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions class="pa-5">
    <v-spacer></v-spacer>
    <v-btn
      class="px-5"
      color="primary"
      elevation="1"
      variant="elevated"
      @click="submitLandlordApplication"
      :disabled="!emailVerificationCode || isSubmitting"
    >
      {{ isSubmitting ? '提交中...' : '提交申请' }}
    </v-btn>
  </v-card-actions>
</v-card>



      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped lang="scss"></style>