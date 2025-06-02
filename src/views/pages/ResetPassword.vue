<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from "@iconify/vue";

const router = useRouter();
const isLoading = ref(false);
const resetForm = ref();
const email = ref("");
const verificationCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isFormValid = ref(true);
const isCodeSent = ref(false); // 控制验证码输入框显示
const isCodeVerified = ref(false); // 控制新密码输入框显示
const countdown = ref(0); // 倒计时
const serverVerificationCode = ref(""); // 存储从服务器返回的验证码

// 验证规则
const emailRules = ref([
  (v: string) => !!v || "请输入邮箱地址",
  (v: string) => /.+@.+\..+/.test(v) || "请输入有效的邮箱地址",
]);

const codeRules = ref([
  (v: string) => !!v || "请输入验证码",
  (v: string) => v.length === 6 || "验证码应为6位数字",
  (v: string) => v === serverVerificationCode.value || "验证码不正确",
]);

const passwordRules = ref([
  (v: string) => !!v || "请输入新密码",
  (v: string) => v.length >= 5 || "密码长度至少为5位",
]);

const confirmPasswordRules = ref([
  (v: string) => !!v || "请确认密码",
  (v: string) => v === newPassword.value || "两次输入的密码不一致",
]);

// 发送验证码
const sendVerificationCode = async () => {
  const { valid } = await resetForm.value.validate();
  
  if (valid) {
    isLoading.value = true;
    
    try {
      const response = await fetch("http://127.0.0.1:5000/user/userinfo/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value
        })
      });

      if (!response.ok) {
        throw new Error("发送验证码失败");
      }

      const data = await response.json();
      
      // 存储服务器返回的验证码
      serverVerificationCode.value = data.data;
      
      isCodeSent.value = true;
      startCountdown();
      alert("验证码已发送至您的邮箱，请查收");
    } catch (error) {
      console.error("发送验证码出错", error);
      alert(error.message || "发送验证码出错");
    } finally {
      isLoading.value = false;
    }
  }
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 120; // 2分钟倒计时
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 验证验证码
const verifyCode = async () => {
  const { valid } = await resetForm.value.validate();
  
  if (valid) {
    isLoading.value = true;
    
    try {
      // 直接比较用户输入的验证码和服务器返回的验证码
      if (verificationCode.value === serverVerificationCode.value) {
        isCodeVerified.value = true;
        alert("验证码验证成功，请设置新密码");
      } else {
        throw new Error("验证码错误");
      }
    } catch (error) {
      console.error("验证验证码出错", error);
      alert(error.message || "验证码错误，请重新输入");
    } finally {
      isLoading.value = false;
    }
  }
};

// 提交重置密码
const handleResetPassword = async () => {
  if (!isCodeSent.value) {
    await sendVerificationCode();
    return;
  }

  if (!isCodeVerified.value) {
    await verifyCode();
    return;
  }

  const { valid } = await resetForm.value.validate();
  
  if (valid) {
    isLoading.value = true;
    
    try {
      const response = await fetch("http://127.0.0.1:5000/user/userinfo/password_e", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: newPassword.value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "密码重置失败");
      }

      alert("密码重置成功，请使用新密码登录");
      router.push("/auth/signin");
    } catch (error) {
      console.error("重置密码出错", error);
      alert(error.message || "重置密码出错，请稍后重试");
    } finally {
      isLoading.value = false;
    }
  }
};

const backToLogin = () => {
  router.push("/auth/signin");
};
</script>

<template>
  <div class="auth-wrapper">
    <v-card color="white" class="auth-card" elevation="3">
      <div class="card-header">
        <v-icon icon="mdi:lock-reset" size="48" color="primary" class="mb-4"></v-icon>
        <v-card-title class="text-h3 font-weight-bold primary--text">
          重置密码
        </v-card-title>
        <v-card-subtitle class="text-subtitle-1 mt-2">
          <template v-if="!isCodeVerified">
            请输入您的注册邮箱，我们将发送密码重置验证码
          </template>
          <template v-else>
            请设置您的新密码
          </template>
        </v-card-subtitle>
      </div>

      <v-card-text class="px-6 py-4">
        <v-form
          ref="resetForm"
          class="text-left"
          v-model="isFormValid"
          lazy-validation
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="电子邮箱"
            placeholder="example@domain.com"
            prepend-inner-icon="mdi:email-outline"
            density="comfortable"
            variant="outlined"
            color="primary"
            bg-color="#f8f9fa"
            name="email"
            validateOn="blur"
            @keyup.enter="handleResetPassword"
            class="mb-4"
            :disabled="isCodeSent"
          ></v-text-field>

          <v-text-field
            v-if="isCodeSent && !isCodeVerified"
            v-model="verificationCode"
            :rules="codeRules"
            label="验证码"
            placeholder="请输入6位验证码"
            prepend-inner-icon="mdi:message-text-outline"
            density="comfortable"
            variant="outlined"
            color="primary"
            bg-color="#f8f9fa"
            name="verificationCode"
            validateOn="blur"
            @keyup.enter="handleResetPassword"
            class="mb-4"
          ></v-text-field>

          <template v-if="isCodeVerified">
            <v-text-field
              v-model="newPassword"
              :rules="passwordRules"
              label="新密码"
              placeholder="请输入至少5位的新密码"
              prepend-inner-icon="mdi:lock-outline"
              density="comfortable"
              variant="outlined"
              color="primary"
              bg-color="#f8f9fa"
              name="newPassword"
              type="password"
              validateOn="blur"
              @keyup.enter="handleResetPassword"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="确认密码"
              placeholder="请再次输入新密码"
              prepend-inner-icon="mdi:lock-check-outline"
              density="comfortable"
              variant="outlined"
              color="primary"
              bg-color="#f8f9fa"
              name="confirmPassword"
              type="password"
              validateOn="blur"
              @keyup.enter="handleResetPassword"
              class="mb-4"
            ></v-text-field>
          </template>

          <v-btn
            :loading="isLoading"
            block
            size="x-large"
            color="primary"
            @click="handleResetPassword"
            class="mt-2 mb-6"
            height="48"
          >
            <template v-slot:loader>
              <v-progress-circular indeterminate color="white"></v-progress-circular>
            </template>
            <span class="text-h6 font-weight-bold">
              <template v-if="!isCodeSent">
                获取验证码
              </template>
              <template v-else-if="isCodeSent && !isCodeVerified">
                验证验证码
                <span v-if="countdown > 0">({{ countdown }}s)</span>
              </template>
              <template v-else>
                重置密码
              </template>
            </span>
          </v-btn>

          <div class="d-flex align-center justify-center my-4">
            <v-divider class="flex-grow-1"></v-divider>
            <span class="px-4 text-caption text-grey">或</span>
            <v-divider class="flex-grow-1"></v-divider>
          </div>

          <v-btn
            variant="outlined"
            color="primary"
            block
            size="large"
            @click="backToLogin"
            class="mb-4"
          >
            <Icon icon="mdi:arrow-left" class="mr-2" />
            <span>返回登录页面</span>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="auth-footer mt-6 text-center">
      <p class="text-body-2 text-grey-darken-1">
        还没有账号？
        <router-link 
          to="/auth/signup" 
          class="text-primary font-weight-bold text-decoration-none"
        >
          立即注册
        </router-link>
      </p>
      <p class="text-caption text-grey mt-2">
        遇到问题？<a href="#" class="text-primary">联系客服</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
}

.auth-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 32px 24px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-card-title {
  line-height: 1.2;
}

.v-card-subtitle {
  color: #6c757d !important;
}

.v-text-field {
  border-radius: 8px;
}

.v-btn {
  letter-spacing: 0.5px;
  text-transform: none;
  border-radius: 8px;
}

.auth-footer {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}
</style>