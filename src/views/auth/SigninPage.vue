<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import router from "~/src/router";
import { nextTick, ref, onUnmounted } from 'vue';
import { userTokenStore } from "@/stores/token";
import { useProfileStore } from "@/stores/profileStore";

const authStore = useAuthStore();
const isLoading = ref(false);
const isSignInDisabled = ref(false);
const isSmsLoading = ref(false);
const isSendingCode = ref(false);
const isEmailCodeLoading = ref(false);
const isSendingEmailCode = ref(false);

// 登录方式切换
const loginMethod = ref("password"); // "password", "sms", "email", or "email-code"

// 表单引用
const refPasswordForm = ref();
const refSmsForm = ref();
const refEmailForm = ref();
const refEmailCodeForm = ref();

// 表单数据
const phone = ref("19511053624");
const password = ref("123456");
const smsCode = ref("");
const email = ref("");
const emailPassword = ref("");
const emailForCode = ref("");
const emailCode = ref("");
const isFormValid = ref(true);

// 短信验证码相关
const countdown = ref(0);
const countdownTimer = ref<NodeJS.Timeout | null>(null);

// 邮箱验证码相关
const emailCountdown = ref(0);
const emailCountdownTimer = ref<NodeJS.Timeout | null>(null);

// 显示密码
const showPassword = ref(false);

// 错误处理
const error = ref(false);
const errorMessages = ref("");

// 密码登录
const handlePasswordLogin = async () => {
  const { valid } = await refPasswordForm.value.validate();

  if (valid) {
    isLoading.value = true;
    isSignInDisabled.value = true;
    error.value = false;
    errorMessages.value = "";

    try {
      await authStore.loginWithUsernameAndPassword(phone.value, password.value);
    } catch (err) {
      console.error("登录出错", err);
      error.value = true;
      errorMessages.value = "用户名或密码错误";
      await nextTick();
      refPasswordForm.value.$el.classList.add('shake');
      setTimeout(() => {
        refPasswordForm.value.$el.classList.remove('shake');
      }, 500);
      return;
    } finally {
      isLoading.value = false;
      isSignInDisabled.value = false;
    }
  }
};

// 发送短信验证码
const sendSmsCode = async () => {
  if (!validatePhone(phone.value)) {
    error.value = true;
    errorMessages.value = "请输入正确的手机号";
    return;
  }

  if (countdown.value > 0) {
    return; // 防止重复发送
  }

  isSendingCode.value = true;
  error.value = false;
  errorMessages.value = "";

  try {
    const response = await axios.post('http://localhost:5000/sms/send-code', {
      phone: phone.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      // 开始倒计时
      startCountdown();
      // 显示成功消息
      errorMessages.value = response.data.message;
      error.value = false;
    } else {
      error.value = true;
      errorMessages.value = response.data.message || "发送验证码失败";
    }
  } catch (err) {
    console.error("发送验证码出错", err);
    error.value = true;
    errorMessages.value = err.response?.data?.message || "网络错误，发送失败";
  } finally {
    isSendingCode.value = false;
  }
};

// 短信验证码登录
const handleSmsLogin = async () => {
  const { valid } = await refSmsForm.value.validate();

  if (valid) {
    isSmsLoading.value = true;
    error.value = false;
    errorMessages.value = "";

    try {
      const response = await axios.post('http://localhost:5000/sms/verify-login', 
        new URLSearchParams({
          phone: phone.value,
          code: smsCode.value
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.code === 201) {
        // 登录成功，处理token
        authStore.setLoggedIn(true);
        
        // 存储token
        const tokenStore = userTokenStore();
        tokenStore.setToken(response.data.data.token);
        
        // 获取用户信息
        const profileRes = await axios.get("http://localhost:5000/user/userinfo", {
          headers: {
            Authorization: response.data.data.token,
          },
        });
        
        if (profileRes.data.code === 200) {
          const ProfileStore = useProfileStore();
          ProfileStore.setUser(profileRes.data.data);
        }
        
        window.location.href = "/dashboard";
      } else {
        error.value = true;
        errorMessages.value = response.data.message || "短信验证登录失败";
      }
    } catch (err) {
      console.error("短信登录出错", err);
      error.value = true;
      errorMessages.value = err.response?.data?.message || "网络错误，登录失败";
    } finally {
      isSmsLoading.value = false;
    }
  }
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60;
  countdownTimer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
      }
    }
  }, 1000);
};

// 验证手机号格式
const validatePhone = (phone) => {
  const pattern = /^1[3-9]\d{9}$/;
  return pattern.test(phone);
};

// 表单验证规则
const phoneRules = ref([
  (v: string) => !!v || "手机号不能为空",
  (v: string) => validatePhone(v) || "请输入正确的手机号格式",
]);

const passwordRules = ref([
  (v: string) => !!v || "密码不能为空",
  (v: string) => (v && v.length <= 20) || "密码长度不能超过20个字符",
]);

const smsCodeRules = ref([
  (v: string) => !!v || "验证码不能为空",
  (v: string) => (v && v.length === 6) || "验证码必须是6位数字",
]);

// 邮箱验证规则
const emailRules = ref([
  (v: string) => !!v || "邮箱不能为空",
  (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(v) || "请输入正确的邮箱格式";
  },
]);

const emailPasswordRules = ref([
  (v: string) => !!v || "密码不能为空",
  (v: string) => (v && v.length <= 20) || "密码长度不能超过20个字符",
]);

const emailCodeRules = ref([
  (v: string) => !!v || "验证码不能为空",
  (v: string) => (v && v.length === 6) || "验证码必须是6位数字",
]);

// 邮箱登录
const handleEmailLogin = async () => {
  const { valid } = await refEmailForm.value.validate();

  if (valid) {
    isLoading.value = true;
    isSignInDisabled.value = true;
    error.value = false;
    errorMessages.value = "";

    try {
      await authStore.loginWithEmailAndPassword(email.value, emailPassword.value);
    } catch (err) {
      console.error("邮箱登录出错", err);
      error.value = true;
      errorMessages.value = "邮箱或密码错误";
      await nextTick();
      refEmailForm.value.$el.classList.add('shake');
      setTimeout(() => {
        refEmailForm.value.$el.classList.remove('shake');
      }, 500);
      return;
    } finally {
      isLoading.value = false;
      isSignInDisabled.value = false;
    }
  }
};

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!emailForCode.value) {
    error.value = true;
    errorMessages.value = "请输入邮箱地址";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailForCode.value)) {
    error.value = true;
    errorMessages.value = "请输入正确的邮箱格式";
    return;
  }

  if (emailCountdown.value > 0) {
    return; // 防止重复发送
  }

  isSendingEmailCode.value = true;
  error.value = false;
  errorMessages.value = "";

  try {
    const response = await axios.post('http://localhost:5000/email-auth/send-code', {
      email: emailForCode.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.code === 201) {
      // 开始倒计时
      startEmailCountdown();
      // 显示成功消息
      errorMessages.value = response.data.message;
      error.value = false;
    } else {
      error.value = true;
      errorMessages.value = response.data.message || "发送验证码失败";
    }
  } catch (err) {
    console.error("发送邮箱验证码出错", err);
    error.value = true;
    errorMessages.value = err.response?.data?.message || "网络错误，发送失败";
  } finally {
    isSendingEmailCode.value = false;
  }
};

// 邮箱验证码登录
const handleEmailCodeLogin = async () => {
  const { valid } = await refEmailCodeForm.value.validate();

  if (valid) {
    isEmailCodeLoading.value = true;
    error.value = false;
    errorMessages.value = "";

    try {
      const response = await axios.post('http://localhost:5000/email-auth/verify-login', 
        new URLSearchParams({
          email: emailForCode.value,
          code: emailCode.value
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.code === 201) {
        // 登录成功，处理token
        authStore.setLoggedIn(true);
        
        // 存储token
        const tokenStore = userTokenStore();
        tokenStore.setToken(response.data.data.token);
        
        // 获取用户信息
        const profileRes = await axios.get("http://localhost:5000/user/userinfo", {
          headers: {
            Authorization: response.data.data.token,
          },
        });
        
        if (profileRes.data.code === 200) {
          const ProfileStore = useProfileStore();
          ProfileStore.setUser(profileRes.data.data);
        }
        
        window.location.href = "/dashboard";
      } else {
        error.value = true;
        errorMessages.value = response.data.message || "邮箱验证登录失败";
      }
    } catch (err) {
      console.error("邮箱验证码登录出错", err);
      error.value = true;
      errorMessages.value = err.response?.data?.message || "网络错误，登录失败";
    } finally {
      isEmailCodeLoading.value = false;
    }
  }
};

// 开始邮箱验证码倒计时
const startEmailCountdown = () => {
  emailCountdown.value = 60;
  emailCountdownTimer.value = setInterval(() => {
    emailCountdown.value--;
    if (emailCountdown.value <= 0) {
      if (emailCountdownTimer.value) {
        clearInterval(emailCountdownTimer.value);
        emailCountdownTimer.value = null;
      }
    }
  }, 1000);
};

// 重置错误
const resetErrors = () => {
  error.value = false;
  errorMessages.value = "";
};

// 重置密码
const resetPassword = () => {
  router.push(`/setpassword`);
};

// 导入需要的stores已在文件开头

// 组件销毁时清理定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
  if (emailCountdownTimer.value) {
    clearInterval(emailCountdownTimer.value);
  }
});
</script>

<template>
  <v-card color="white" class="pa-3 ma-3" elevation="3">
    <v-card-title class="my-4 text-h4">
      <span class="flex-fill">欢迎登录</span>
    </v-card-title>
    <v-card-subtitle>选择登录方式</v-card-subtitle>

    <!-- 错误提示 -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4 mx-3"
      dismissible
      @click:close="error = false"
    >
      {{ errorMessages }}
    </v-alert>

    <!-- 成功提示 -->
    <v-alert
      v-if="!error && errorMessages"
      type="success"
      variant="tonal"
      class="mb-4 mx-3"
      dismissible
      @click:close="errorMessages = ''"
    >
      {{ errorMessages }}
    </v-alert>

    <v-card-text>
      <!-- 登录方式选择 -->
      <v-tabs v-model="loginMethod" class="mb-4" color="primary">
        <v-tab value="password">
          <v-icon start>mdi-lock</v-icon>
          密码登录
        </v-tab>
        <v-tab value="sms">
          <v-icon start>mdi-message-text</v-icon>
          短信登录
        </v-tab>
        <v-tab value="email">
          <v-icon start>mdi-email</v-icon>
          邮箱登录
        </v-tab>
        <v-tab value="email-code">
          <v-icon start>mdi-email-check</v-icon>
          邮箱验证码
        </v-tab>
      </v-tabs>

      <!-- 密码登录表单 -->
      <v-window v-model="loginMethod">
        <v-window-item value="password">
          <v-form
            ref="refPasswordForm"
            class="text-left"
            v-model="isFormValid"
            lazy-validation
          >
            <v-text-field
              v-model="phone"
              required
              :error="error"
              label="手机号"
              placeholder="请输入手机号"
              density="default"
              variant="underlined"
              color="primary"
              bg-color="#fff"
              :rules="phoneRules"
              name="phone"
              prepend-inner-icon="mdi-cellphone"
              @keyup.enter="handlePasswordLogin"
              @change="resetErrors"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :error="error"
              label="密码"
              placeholder="请输入密码"
              density="default"
              variant="underlined"
              color="primary"
              bg-color="#fff"
              :rules="passwordRules"
              name="password"
              prepend-inner-icon="mdi-lock"
              @change="resetErrors"
              @keyup.enter="handlePasswordLogin"
              @click:append-inner="showPassword = !showPassword"
            ></v-text-field>

            <v-btn
              :loading="isLoading"
              :disabled="isSignInDisabled"
              block
              size="x-large"
              color="primary"
              @click="handlePasswordLogin"
              class="mt-4 font-weight-bold"
            >
              登录
            </v-btn>
          </v-form>
        </v-window-item>

        <!-- 短信登录表单 -->
        <v-window-item value="sms">
          <v-form
            ref="refSmsForm"
            class="text-left"
            v-model="isFormValid"
            lazy-validation
          >
            <v-text-field
              v-model="phone"
              required
              label="手机号"
              placeholder="请输入手机号"
              density="default"
              variant="underlined"
              color="primary"
              bg-color="#fff"
              :rules="phoneRules"
              name="phone"
              prepend-inner-icon="mdi-cellphone"
              @change="resetErrors"
            ></v-text-field>

            <div class="d-flex align-center">
              <v-text-field
                v-model="smsCode"
                required
                label="验证码"
                placeholder="请输入6位验证码"
                density="default"
                variant="underlined"
                color="primary"
                bg-color="#fff"
                :rules="smsCodeRules"
                name="smsCode"
                prepend-inner-icon="mdi-message-text"
                class="flex-grow-1 mr-2"
                @keyup.enter="handleSmsLogin"
                @change="resetErrors"
              ></v-text-field>

              <v-btn
                :loading="isSendingCode"
                :disabled="countdown > 0 || !validatePhone(phone)"
                color="primary"
                variant="outlined"
                @click="sendSmsCode"
                class="mb-6"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </v-btn>
            </div>

            <v-btn
              :loading="isSmsLoading"
              :disabled="!smsCode || smsCode.length !== 6"
              block
              size="x-large"
              color="primary"
              @click="handleSmsLogin"
              class="mt-4 font-weight-bold"
            >
              登录
            </v-btn>
          </v-form>
        </v-window-item>

        <!-- 邮箱登录表单 -->
        <v-window-item value="email">
          <v-form
            ref="refEmailForm"
            class="text-left"
            v-model="isFormValid"
            lazy-validation
          >
            <v-text-field
              v-model="email"
              required
              :error="error"
              label="邮箱"
              placeholder="请输入邮箱地址"
              density="default"
              variant="underlined"
              color="primary"
              bg-color="#fff"
              :rules="emailRules"
              name="email"
              prepend-inner-icon="mdi-email"
              @keyup.enter="handleEmailLogin"
              @change="resetErrors"
            ></v-text-field>

            <v-text-field
              v-model="emailPassword"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :error="error"
              label="密码"
              placeholder="请输入密码"
              density="default"
              variant="underlined"
              color="primary"
              bg-color="#fff"
              :rules="emailPasswordRules"
              name="emailPassword"
              prepend-inner-icon="mdi-lock"
              @change="resetErrors"
              @keyup.enter="handleEmailLogin"
              @click:append-inner="showPassword = !showPassword"
            ></v-text-field>

            <v-btn
              :loading="isLoading"
              :disabled="isSignInDisabled"
              block
              size="x-large"
              color="primary"
              @click="handleEmailLogin"
              class="mt-4 font-weight-bold"
            >
              登录
            </v-btn>
                     </v-form>
         </v-window-item>

         <!-- 邮箱验证码登录表单 -->
         <v-window-item value="email-code">
           <v-form
             ref="refEmailCodeForm"
             class="text-left"
             v-model="isFormValid"
             lazy-validation
           >
             <v-text-field
               v-model="emailForCode"
               required
               label="邮箱"
               placeholder="请输入邮箱地址"
               density="default"
               variant="underlined"
               color="primary"
               bg-color="#fff"
               :rules="emailRules"
               name="emailForCode"
               prepend-inner-icon="mdi-email"
               @change="resetErrors"
             ></v-text-field>

             <div class="d-flex align-center">
               <v-text-field
                 v-model="emailCode"
                 required
                 label="验证码"
                 placeholder="请输入6位验证码"
                 density="default"
                 variant="underlined"
                 color="primary"
                 bg-color="#fff"
                 :rules="emailCodeRules"
                 name="emailCode"
                 prepend-inner-icon="mdi-email-check"
                 class="flex-grow-1 mr-2"
                 @keyup.enter="handleEmailCodeLogin"
                 @change="resetErrors"
               ></v-text-field>

               <v-btn
                 :loading="isSendingEmailCode"
                 :disabled="emailCountdown > 0 || !emailForCode"
                 color="primary"
                 variant="outlined"
                 @click="sendEmailCode"
                 class="mb-6"
               >
                 {{ emailCountdown > 0 ? `${emailCountdown}s` : '发送验证码' }}
               </v-btn>
             </div>

             <v-btn
               :loading="isEmailCodeLoading"
               :disabled="!emailCode || emailCode.length !== 6"
               block
               size="x-large"
               color="primary"
               @click="handleEmailCodeLogin"
               class="mt-4 font-weight-bold"
             >
               登录
             </v-btn>
           </v-form>
         </v-window-item>
       </v-window>

      <div class="mt-5 text-center">
        <router-link class="text-primary" to="/auth/forgot-password" @click="resetPassword">
          忘记密码？
        </router-link>
      </div>
    </v-card-text>
  </v-card>

  <div class="text-center mt-6">
    还没有账号？
    <router-link to="/auth/signup" class="text-primary font-weight-bold">
      立即注册
    </router-link>
  </div>
</template>

<style scoped>
.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
</style>