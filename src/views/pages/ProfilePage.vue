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

import { useSnackbarStore } from "~/src/stores/snackbarStore";
const snackbarStore = useSnackbarStore();
//图像裁剪
import AvatarCropper from '~/src/components/User/AvatarCropper.vue'; 
const isCropperOpen = ref(false);
// 3. 准备处理上传的函数，它会接收子组件传来的 blob 和 done 回调
const onAvatarUpload = async (blob: Blob, done: () => void) => {
  console.log("收到裁剪后的Blob，开始新的两步上传流程...", blob);
  // 1. 将收到的 Blob 包装成 File 对象，准备上传到OSS
  const avatarFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
  const ossFormData = new FormData();
  ossFormData.append("image", avatarFile); // 后端OSS接口接收的字段名叫 'image'
  try {
    // --- 步骤 1: 上传图片到 OSS 接口 ---
    console.log("步骤1: 正在上传图片到OSS...");
    const ossResponse = await axios.post(
      'http://localhost:5000/oss/upload_general_image',
      ossFormData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    if (!ossResponse.data || !ossResponse.data.success) {
      // 如果oss上传失败，则直接抛出错误
      throw new Error(ossResponse.data.message || '图片服务器上传失败');
    }

    const newAvatarUrl = ossResponse.data.image_url;
    console.log("步骤1成功: 获取到新的OSS URL:", newAvatarUrl);

    // --- 步骤 2: 将新的 OSS URL 更新到用户信息中 ---
    console.log("步骤2: 正在更新用户信息...");
    const userId = profileStore.getUserId(); // 从你的 store 获取用户ID
    console.log("用户ID:", userId);
    // 准备只包含头像信息的 payload
    const userInfoPayload = {
      id: userId,
      avatarUrl: newAvatarUrl // 你的用户表里字段名可能是 avatarUrl
    };

    const userUpdateResponse = await axios.put(
      'http://localhost:5000/user/userinfo',
      userInfoPayload
    );

    if (!userUpdateResponse.data || !userUpdateResponse.data.success) {
        throw new Error(userUpdateResponse.data.message || '更新用户信息失败');
    }
    
    // --- 全部成功 ---
    console.log("步骤2成功: 用户信息已更新");
    snackbarStore.showSuccessMessage('头像更新成功！');
    
    // 更新 Pinia Store，让页面上的头像立刻变化
    profileStore.updateAvatar(newAvatarUrl);
    // 上传成功后刷新头像
    loadUserAvatar();
    
    // 关闭裁剪对话框
    isCropperOpen.value = false; // 假设你的对话框开关是 isCropperOpen

  } catch (error: any) {
    // 统一处理上述两个步骤中任意环节的错误
    const errorMessage = error.message || '操作失败，请重试';
    snackbarStore.showErrorMessage(errorMessage);
    console.error('头像更新流程出错:', error);
  } finally {
    // 无论成功还是失败，都必须调用 done() 回调
    // 这会通知 AvatarCropper 组件解除 loading 状态
    done();
  }

};
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
const navigateToRent1 = () => {
  router.push({
    path: '/myHouse'
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

// 在 data 部分添加
const receivedVerificationCode = ref(''); // 存储从后端获取的验证码

const sendEmailVerificationCode = async () => {
  if (!user.email) {
    verificationError.value = '邮箱地址不能为空';
    return;
  }
  
  try {
    isSendingCode.value = true;
    verificationError.value = '';
    
    const response = await axios.post('http://localhost:5000/user/userinfo/tolanlord', {
      email: user.email
    });
    
    if (response.data.code === 200) {
      // 保存验证码到 receivedVerificationCode
      receivedVerificationCode.value = response.data.data;
      
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
  
  // 添加验证码比对
  if (emailVerificationCode.value !== receivedVerificationCode.value) {
    verificationError.value = '验证码不正确，请重新输入';
    return;
  }
  
  try {
    isSubmitting.value = true;
    verificationError.value = '';
    
    const response = await axios.put('http://localhost:5000/user/userinfo/usertype', {
      email: user.email,
      code: emailVerificationCode.value
    });
    
    if (response.data.code === 200) {
      snackbar.color = 'success';
      snackbar.message = '申请已提交，请重新登陆以获取状态';
      snackbar.show = true;
      userType.value = 2;
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

//名字映射
const typeMap = {
  1: { name: '租客',   color: 'blue'   },
  2: { name: '房东',   color: 'green'  },
  0: { name: '管理员', color: 'red'    }
};
const chipInfo = computed(() => typeMap[userType.value] ?? typeMap[0]);
//下面进行用户头像上传-------------------------------
//计划涉及云服务上传---------------------------------
//本地图片------------------------------------------
//获取连接------------------------------------------
// 在现有导入基础上添加------------------------------

const avatarFile = ref<File | null>(null);
const isUploading = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);

const avatarRefreshKey = ref(0); // 用于强制刷新图片缓存

// 定义默认头像URL（已调整到更靠前的位置）
const DEFAULT_AVATAR = "http://localhost:5000/user/images/16_20250612121326.jpg";

// 获取用户头像（修改了默认值设置逻辑）
const loadUserAvatar = async () => {
  try {
    // 修改API路径与请求方式，使用GET并传递id参数
    const response = await axios.get(
      `http://localhost:5000/user/userinfo/avatar`,
      { params: { id: profileStore.getUserId() } }
    );
    
    if (response.data.code === 200) {
      user.avatarUrl = response.data.data.avatarUrl;
    } else {
      console.error('获取头像失败:', response.data.message);
      user.avatarUrl = DEFAULT_AVATAR; // 服务器返回错误时使用默认头像
    }
  } catch (error) {
    console.error('加载头像失败:', error);
    user.avatarUrl = DEFAULT_AVATAR; // 异常时使用默认头像
  } finally {
    avatarRefreshKey.value++; // 确保头像刷新
  }
};

// 头像上传处理（新增默认头像回退逻辑）
const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    isUploading.value = true;
    avatarFile.value = input.files[0];
    
    try {
      // 1. 先预览新头像
      const reader = new FileReader();
      reader.onload = (e) => {
        user.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(avatarFile.value);
      
      // 2. 上传到服务器
      const formData = new FormData();
      formData.append('avatar', avatarFile.value);
      formData.append('userId', profileStore.getUserId());

      const response = await axios.post('http://localhost:5000/user/userinfo/avatarurl', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.code === 200) {
        profileStore.updateAvatar(response.data.data.avatarUrl);
        // 上传成功后刷新头像
        loadUserAvatar();
      } else {
        // 上传失败时回退到默认头像
        user.avatarUrl = DEFAULT_AVATAR;
      }
    } catch (error) {
      console.error('上传失败:', error);
      // 异常时回退到默认头像
      user.avatarUrl = DEFAULT_AVATAR;
    } finally {
      isUploading.value = false;
    }
  }
};
// 触发文件选择
const triggerFileInput = () => {
  avatarInput.value?.click();
};


</script>

<template>
  <v-container>
    <AvatarCropper v-model:dialog="isCropperOpen" @upload="onAvatarUpload" />
  </v-container>
  <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">

    <!-- 添加Snackbar通知 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>

    <v-row>

    <v-col cols="12" md="3">
  <v-card>
    <div class="d-flex flex-column pa-10">
        <!-- 头像显示（使用数据库中的URL） -->
        <!-- 头像显示（优化默认值判断逻辑） -->
      <v-avatar size="120" class="mx-auto elevation-12" color="white">
        <v-img 
          :src="user.avatarUrl || DEFAULT_AVATAR" 
          :key="avatarRefreshKey" 
          @click="isCropperOpen = true" style="cursor: pointer;"
        ></v-img>
      </v-avatar>
      
      
      
      <!-- 隐藏的文件输入 -->
      <input
        ref="avatarInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleAvatarUpload"
      />

      <div class="text-center mt-5">
        <h3 class="text-h6 font-weight-bold">
          {{user.name}}
                <v-chip
          size="small"
          class="font-weight-bold"
          :color="chipInfo.color"
        >
          {{ chipInfo.name }}
        </v-chip>
        </h3>
        
      </div>
      <!-- 上传按钮（始终显示） -->
      <v-btn
        class="mt-3"
        color="primary"
        :loading="isUploading"
        @click="avatarInput?.click()"
        disabled
      >
        更换头像(请点击头像)
      </v-btn>
    </div>

    <v-divider></v-divider>
    <div class="py-5 px-10">
      <v-icon color="grey"> mdi-map-marker </v-icon>
      <span class="ml-4">长沙</span>
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
                class="px-5 mr-2  "
                color="primary"
                elevation="1"
                variant="elevated"
                @click="navigateToRent1"
                v-if="userType === 2"
              >
                我的房源
              </v-btn>
            
            
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
              @click="navigateToRent"
            >
              租房列表
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
                    icon="logos:microsoft-icon"
                    class="mr-3 my-2"
                  />Microsoft
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