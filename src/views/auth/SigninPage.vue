
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import router from "~/src/router";



const authStore = useAuthStore();
const isLoading = ref(false);
const isSignInDisabled = ref(false);

const refLoginForm = ref();
const username = ref("ylfmoonn");
const phone =ref("19511053624")
const email = ref("vuetify3-visitor@gmail.com");
const password = ref("123456");
const isFormValid = ref(true);


//Google
// show password field
const showPassword = ref(false);

import { nextTick } from 'vue';
const handleLogin = async () => {
  const { valid } = await refLoginForm.value.validate();

  if (valid) {
    isLoading.value = true;
    isSignInDisabled.value = true;
    error.value = false; // 重置错误状态
    errorMessages.value = ""; // 清空错误消息

    try {
      await authStore.loginWithUsernameAndPassword(phone.value, password.value);
    } catch (err) {
      console.error("登录出错", err);
      // 确保错误状态更新
      error.value = true;
      errorMessages.value = "用户名或密码错误";
      // 强制UI更新
      await nextTick();
      // 震动效果
      refLoginForm.value.$el.classList.add('shake');
      setTimeout(() => {
        refLoginForm.value.$el.classList.remove('shake');
      }, 500);
      return; // 直接返回，避免继续执行
    } finally {
      isLoading.value = false;
      isSignInDisabled.value = false;
    }
  } else {
    console.log("表单验证失败");
  }
};



// Error Check
const emailRules = ref([
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);
const usernameRules = ref([
  (v: string) => !!v || "Phone is required",
]);
const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) =>
    (v && v.length <= 10) || "Password must be less than 10 characters",
]);



const error = ref(false);
const errorMessages = ref("");
const resetErrors = () => {
  error.value = false;
  errorMessages.value = "";
};



const resetPassword = () => {
  // 重置密码
   router.push(`/setpassword`);
  }

</script>
<template>
  <v-card color="white" class="pa-3 ma-3" elevation="3">
    <v-card-title class="my-4 text-h4">
      <span class="flex-fill"> Welcome </span>
    </v-card-title>
    <v-card-subtitle>Sign in to your account</v-card-subtitle>

      
     <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4 mx-3"
      dismissible
      @click:close="error = false"
    >
      <v-icon start icon="mdi-alert-circle-outline"></v-icon>
      {{ errorMessages }}
    </v-alert>

    <!-- sign in form -->

    <v-card-text>
      <v-form
        ref="refLoginForm"
        class="text-left"
        v-model="isFormValid"
        lazy-validation
      >
      <v-text-field
        ref="refUsername"
        v-model="phone"
        required
        :error="error"
        :label="$t('Phone')"
        placeholder="输入手机号"
        density="default"
        variant="underlined"
        color="primary"
        bg-color="#fff"
        :rules="usernameRules"
        name="Phone"
        outlined
        validateOn="blur"
        @keyup.enter="handleLogin"
        @change="resetErrors"
      ></v-text-field>
        <v-text-field
          ref="refPassword"
          v-model="password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :error="error"
          :error-messages="errorMessages"
          :label="$t('login.password')"
          placeholder="sfm12345"
          density="default"
          variant="underlined"
          color="primary"
          bg-color="#fff"
          :rules="passwordRules"
          name="password"
          outlined
          validateOn="blur"
          @change="resetErrors"
          @keyup.enter="handleLogin"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>


        <v-btn
          :loading="isLoading"
          :disabled="isSignInDisabled"
          block
          size="x-large"
          color="primary"
          @click="handleLogin"
          class="mt-2 font-weight-bold "
          >登录</v-btn
        >
      


        <div class="mt-5 text-center">
          <router-link class="text-primary" to="/auth/forgot-password" @click="resetPassword">
            <!--{{ $t("login.forgot") }}-->
             忘记密码？
          </router-link>
        </div>
      </v-form></v-card-text
    >
  </v-card>
  <div class="text-center mt-6">
    {{ $t("login.noaccount") }}
    <router-link to="/auth/signup" class="text-primary font-weight-bold">
      {{ $t("login.create") }}
    </router-link>
  </div>
</template>