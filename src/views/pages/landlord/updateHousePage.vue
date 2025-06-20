<script setup lang="ts">
import { ref, computed,onMounted } from "vue"; // computed 可能不再需要，除非有其他计算属性
import moment from "moment";
import { formatFileSize } from "@/utils/common";
import AnimationUpload from "./SDComponents/AnimationUpload.vue";
import axios from "axios";

//导入路由
import { useRoute } from 'vue-router';
const route = useRoute();

const id = route.params.id as string | undefined;
const isEdit = computed(() => !!id);


// 解决 window.grecaptcha 类型报错
declare global {
  interface Window {
    grecaptcha?: {
      getResponse: () => string;
      reset?: () => void;
      render?: (...args: any[]) => any;
      [key: string]: any;
    };
  }
}

//获取函数
const fetchHouse = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/houseinfo/${id}`);
    Object.assign(house_info.value, data.data);
  } catch (e) {
    snackbarStore.showErrorMessage('获取房屋信息失败');
  }
};

const fetchHouseDetail = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/housedetail/${id}`);
    Object.assign(house_detail.value, data.data);
  } catch (e) {
    snackbarStore.showErrorMessage('获取房屋详情失败');
  }
};

//谷歌验证码
const recaptchaSiteKey = '6LfRXlMrAAAAAIjs0Ln_JceX4X9l3DfVM5CNvjop' // 替换为你的 site key

//房东信息
import { useProfileStore } from "~/src/stores/profileStore";
import { useRouter } from 'vue-router';
const router = useRouter();
const profileStore = useProfileStore();
const user = reactive({ ...profileStore.user});
const coverImage = ref<File | null>(null); // 封面图片
const filesFromInput = ref<File[]>([]);
const allProcessedFileInfos = ref<any[]>([]);
const allRawFiles = ref<File[]>([]);


const processNewFiles = async (newlySelectedFiles: File[]) => {
  if (!newlySelectedFiles || newlySelectedFiles.length === 0) {
    
    return;
  }

  const newFileProcessingPromises = [];

  for (const file of newlySelectedFiles) {
    
    const isDuplicate = allRawFiles.value.some(
      (existingFile) => existingFile.name === file.name && existingFile.size === file.size
    );
    if (isDuplicate) {
      console.warn(`File "${file.name}" is already added. Skipping.`);
      continue; // Skip this file
    }

    
    allRawFiles.value.push(file);

    const reader = new FileReader();
    reader.readAsDataURL(file); // Generate Base64 for preview link

    const filePromise = new Promise((resolve, reject) => {
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          resolve({
            // Generate a unique key for v-for, especially if names can be non-unique
            // Consider using a small utility for generating simple unique IDs if needed, or file.name + file.lastModified
            key: `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            size: formatFileSize(file.size),
            imageSize: `${img.width}x${img.height}`,
            type: file.type,
            suffix: file.name.split(".").pop() || "",
            lastModifiedDate: moment(file.lastModified).format("YYYY-MM-DD HH:mm:ss"),
            link: reader.result, // Base64 Data URL for <v-img src>
            rawFile: file, // Keep reference to original File object
            previewEnabled: true,
          });
        };
        img.onerror = () => {
          console.error("Image load error for preview:", file.name);
          resolve({ // Still resolve, but indicate preview error
            key: `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}-error`,
            name: file.name,
            size: formatFileSize(file.size),
            imageSize: "N/A",
            type: file.type,
            suffix: file.name.split(".").pop() || "",
            lastModifiedDate: moment(file.lastModified).format("YYYY-MM-DD HH:mm:ss"),
            link: null, // Or a placeholder error image URL
            rawFile: file,
            previewEnabled: false,
          });
        };
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error); // This might stop Promise.all, consider resolving with error state
      };
    });
    newFileProcessingPromises.push(filePromise);
  }

  try {
    const newInfos = await Promise.all(newFileProcessingPromises);
    allProcessedFileInfos.value.push(...newInfos.filter(info => info !== null)); // Add new file infos to the main list
  } catch (error) {
    console.error("Error processing files:", error);
  }

  
};

// --- Remove a specific image ---
const removeImage = (fileInfoToRemove: any) => {
  const indexInInfos = allProcessedFileInfos.value.findIndex(info => info.key === fileInfoToRemove.key);
  if (indexInInfos !== -1) {
    allProcessedFileInfos.value.splice(indexInInfos, 1);
  }

  const indexInRaw = allRawFiles.value.findIndex(
    (rawFile) => rawFile.name === fileInfoToRemove.name &&
                 rawFile.lastModified === fileInfoToRemove.rawFile.lastModified // More robust check
  );
  if (indexInRaw !== -1) {
    allRawFiles.value.splice(indexInRaw, 1);
  }

  
};

// --- Clear all selected and previewed files ---
const clearFiles = () => {
  filesFromInput.value = [];       
  allProcessedFileInfos.value = [];
  allRawFiles.value = [];          
};


const features = ref([
  {
    image: 'https://d214hhm15p4t1d.cloudfront.net/nzr/3506522640180f883a58a6849beb1d2463794133/img/comprehensiveListings.d279ced0.svg',
    title: '综合房源浏览',
    description: '我们致力于为您的房源提供优质的服务',
  },
  {
    image: 'https://d214hhm15p4t1d.cloudfront.net/nzr/3506522640180f883a58a6849beb1d2463794133/img/usefulResources.d2e569af.svg',
    title: '丰富的数据管理',
    description: '选择我们的租房平台，动态查看您的租房数据和账目，轻松管理您的租房信息。',
  },
  {
    image: 'https://d214hhm15p4t1d.cloudfront.net/nzr/3506522640180f883a58a6849beb1d2463794133/img/peaceOfMind.cfc8536a.svg',
    title: '心旷神怡',
    description: '一站式租房服务，让您轻松上传房源，快速找到合适的租客。',
  }
]);
//消息条
import { useSnackbarStore } from "@/stores/snackbarStore";
import { s } from "vitest/dist/types-e3c9754d";
const snackbarStore = useSnackbarStore();
//房屋信息
const house_detail = ref({ 
  created_at: "2025-05-22T21:32:16",
  detail_id: 1,
  facilities: { 
    tv: true,
    washer: true,
    wifi: true,
    refrigerator: true, 
    bed: true,
    airconditioner: false 
  },
  house_info_id: 1,
  map_coordinates: { lat: 30.0, lng: 120.0 }, // 修正了下 map_coordinates 格式
  photos: [ /* ... */ ],
  updated_at: "2025-05-22T21:34:28"
});
const house_info =ref( 
  
  {
        area: 73.0,
        available: 1,
        block: "树木岭",
        community: "锦源小区",
        decoration: "精装",
        direction: "南",
        house_num: "10001",
        id: 1,
        image_url: "https://i.pinimg.com/736x/c4/3a/90/c43a90fcf336e05d7f849b527f067464.jpg",
        landlord: "张先生",
        phone_num: "13800001234",
        price: 1600,
        publish_time: "2025-05-15",
        region: "雨花",
        rent_type: "整租",
        rooms: "2室1厅1卫",
        subway: 1,
        tag_new: 1,
        title: "整租·锦源小区 2室1厅 南"
  },
);
// 房屋装修类型
const decorationTypes = ref(['毛坯', '简装', '精装']);
const orientations = ref(['东', '南', '西', '北', '南北', '东西', '东北', '西北', '东南', '西南']);
const availableRegions = ref([
{ text: '岳麓', value: '岳麓' }, { text: '雨花', value: '雨花' },
{ text: '天心', value: '天心' }, { text: '芙蓉', value: '芙蓉' },
{ text: '望城', value: '望城' }, { text: '长沙县', value: '长沙县' }
]);
const rentTypes = ref(['整租', '合租']);

//房屋设施
const allAmenities = ref([ // 你的 allAmenities 定义保持不变
  { key: 'tv', label: '电视', icon: 'material-symbols:tv-outline-rounded', value: 'tv' }, // v-select 需要 value prop
  { key: 'washer', label: '洗衣机', icon: 'material-symbols:local-laundry-service-outline-sharp', value: 'washer' },
  { key: 'airconditioner', label: '空调', icon: 'material-symbols:ac-unit-outline', value: 'airconditioner' },
  { key: 'wardrobe', label: '衣柜', icon: 'material-symbols:dresser-outline', value: 'wardrobe' },
  { key: 'refrigerator', label: '冰箱', icon: 'material-symbols:kitchen-outline-rounded', value: 'refrigerator' },
  { key: 'waterheater', label: '热水器', icon: 'material-symbols:water-heater-outline', value: 'waterheater' },
  { key: 'bed', label: '床', icon: 'material-symbols:bed-outline', value: 'bed' },
  { key: 'heating', label: '暖气', icon: 'material-symbols:radiator-outline', value: 'heating' },
  { key: 'wifi', label: '宽带', icon: 'material-symbols:wifi-rounded', value: 'wifi' },
  { key: 'naturalgas', label: '天然气', icon: 'material-symbols:outdoor-grill-outline', value: 'naturalgas' }
]);
const selectedAmenityKeysForSelect = ref<string[]>([]);
const updateSelectedKeysFromFacilities = () => {
  const keys = [];
  if (house_detail.value.facilities) {
    for (const key in house_detail.value.facilities) {
      if (house_detail.value.facilities[key] === true) {
        keys.push(key);
      }
    }
  }
  selectedAmenityKeysForSelect.value = keys;
};
onMounted(async() => {
  if (isEdit.value) {
    await fetchHouse();
    await fetchHouseDetail();
    // 同步设施复选框
    updateSelectedKeysFromFacilities();
  }
  const script = document.createElement('script')
  script.src = 'https://www.google.com/recaptcha/api.js'
  script.async = true
  script.defer = true
  document.head.appendChild(script)

});
watch(() => house_detail.value.facilities, () => {
  updateSelectedKeysFromFacilities();
}, { deep: true });
//提交
// const uploadNewHouse = () => {
//   console.log("上传房源信息：", house_info.value);
//   console.log("上传房屋设施：", selectedAmenityKeysForSelect.value);
//   console.log("上传房源图片：", allProcessedFileInfos.value);
//   console.log("上传房东信息：", user);
//   console.log("房屋详情", house_detail.value);
//   console.log("所有原始文件：", allRawFiles.value);
// };
// --- 上传和提交函数 ---
const isPass = ref(false); // 用于控制是否通过验证
const bypassCaptcha= () => {
  isPass.value = !isPass.value; // 反转验证状态
  console.log(isPass.value ? "已通过验证" : "验证已重置")
};
const isSubmitting = ref(false); // 用于控制提交状态
const uploadNewHouse = async () => {
  const response = window.grecaptcha?.getResponse();
  if(isPass.value){
    console.log("测试后门");
  } else {
    if (!response) {
    snackbarStore.showErrorMessage(`请先完成验证`);
    return
    }
  };
  isSubmitting.value = true;
  console.log("开始上传流程...");
  console.log("所有原始待上传文件：", allRawFiles.value.map(f => f.name));
  let uploadedImageUrlsFromServer: string[] = [];
  // 步骤1: 上传所有图片 (allRawFiles) 到批量接口
  if (allRawFiles.value.length > 0) {
    const formData = new FormData();
    allRawFiles.value.forEach(file => {
      formData.append('detail_images', file, file.name); 
    });

    try {
      const response = await axios.post('http://localhost:5000/oss/upload_property_detail_images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success && response.data.photo_urls && Array.isArray(response.data.photo_urls)) {
        uploadedImageUrlsFromServer = response.data.photo_urls;
        console.log("图片批量上传成功，返回的URL列表:", uploadedImageUrlsFromServer);
      } else {
        console.error("图片批量上传失败，响应数据格式不正确:", response.data);
        snackbarStore.showErrorMessage(`图片批量上传失败: ${response.data.message || '未知错误'}`);
        isSubmitting.value = false;
        return; // 中断后续操作
      }
    } catch (error) {
      console.error("请求图片批量上传接口错误:", error);
      console.error("错误详情:", error.response?.data || error.message);
      snackbarStore.showErrorMessage(`图片批量上传请求失败: ${error.response?.data?.message || error.message || '请检查网络或联系管理员。'}`);
      isSubmitting.value = false;
      return; // 中断后续操作
    }
  } else {
    console.log("没有选择新图片进行上传。");
  
  }

  // 步骤2: 准备 house_info 数据
  const coverImageUrl = uploadedImageUrlsFromServer.length > 0 ? uploadedImageUrlsFromServer[0] : ""; // 强制第一张为封面，如果没有上传则为空字符串
  
  const finalHouseInfoData = {
    ...house_info.value, // 展开你的表单数据
    image_url: coverImageUrl,
    landlord: user.name,    // (修改点1) 从 user对象获取
    phone_num: user.phone,  // (修改点1) 从 user对象获取
    
  };
  // 对于新建操作，不应发送 id
  if ('id' in finalHouseInfoData) {
    delete (finalHouseInfoData as any).id;
  }


  // 步骤3: 准备 house_detail 数据
  // 3a. 转换 facilities
  const facilitiesObject: Record<string, boolean> = {};
  allAmenities.value.forEach(amenity => {
    facilitiesObject[amenity.key] = selectedAmenityKeysForSelect.value.includes(amenity.key);
  });

  // 3b. 准备 photos 列表 (排除封面图)
  const detailPhotoUrls = uploadedImageUrlsFromServer.length > 1 ? uploadedImageUrlsFromServer.slice(1) : [];

  const finalHouseDetailData = {
    facilities: facilitiesObject,
    map_coordinates: house_detail.value.map_coordinates, // 确保这个数据是你后端期望的格式
    photos: detailPhotoUrls,
    // detail_id, house_info_id, created_at, updated_at 由后端处理
  };

  // 步骤4: 组装最终的 Payload
  const finalPayload = {
    house_info: finalHouseInfoData,
    house_detail: finalHouseDetailData
  };

  console.log("最终提交给 /create_full_listing 的 Payload:", JSON.stringify(finalPayload, null, 2));

  // 步骤5: 调用创建完整房源接口
  try {
    const response = await axios.put(`http://localhost:5000/houseinfo/${id}/full_update`, finalPayload);
    if (response.data.success) {
      console.log("房源更新成功，返回数据:", response.data);
      snackbarStore.showSuccessMessage(`房源更新成功! ID: ${response.data.data.house_info.id}`);
      setTimeout(() => {
      router.push('/'); // <-- 4. 3秒后跳转到新闻列表页
    }, 3000);
    } else {
      console.error("房源更新失败，响应数据格式不正确:", response.data);
      snackbarStore.showErrorMessage(`房源更新失败: ${response.data.message || '未知错误'}`);
    }
  } catch (error: any) {
    console.error("请求更新房源接口错误:", error);
    snackbarStore.showErrorMessage(`房源更新请求失败: ${error.response?.data?.message || error.message || '请检查网络或联系管理员。'}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <v-container>
   
    <v-row class="mb-5">
      <!-- ---------------------------------------------- -->    
      <!-- 标题banner -->
      <!-- ---------------------------------------------- -->
      <v-col cols="12" md="12" lg="12">
      <v-sheet color="white" class="py-10 text-center">
      <h1 class="text-h4 font-weight-bold header-title mb-3">
          编辑房源信息
        </h1>
        <p class="text-subtitle-1 header-subtitle mx-auto" style="max-width: 600px;">
          数万线下门店 · 快速全域推广 · 专业经纪人服务 
        </p>
      <!-- <v-container>
        <v-row justify="center">
          <v-col
            v-for="(feature, i) in features"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            class="text-center pa-4 d-flex flex-column align-center"
          >
            <div class="mb-5" style="position: relative;">
              <v-img
                :src="feature.image"
                :alt="feature.title"
                height="120px" 
                width="auto"  
                contain        
              >
                  <v-icon color="yellow-darken-2" style="position: absolute; top: 0; left: 0; font-size: 16px;">mdi-star-four-points</v-icon>
              </v-img>
            </div>

            <h3 class="text-h6 font-weight-bold mb-3" style="color: #2c3e50;"> 
              {{ feature.title }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mx-auto" style="max-width: 320px; line-height: 1.7;">
              {{ feature.description }}
            </p>
          </v-col>
        </v-row>
      </v-container> -->
     </v-sheet>
    </v-col>
    <v-col cols="12" md="12">
        <!-- ---------------------------------------------- -->
        <!--   Basic Infomation -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            房屋基本信息
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">房屋标题</v-label>
                <v-text-field
                  v-model="house_info.title"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="房屋标题"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">房屋小区</v-label>
                <v-text-field
                  v-model="house_info.community"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="小区"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">价格/月</v-label>
                <v-text-field
                  class="bg-red-lighten-5"
                  
                  v-model="house_info.price"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="房屋价格"
                  hide-details
              /></v-col>
            <v-col cols="12" sm="3">
  
  <v-chip-group
    v-model="house_info.decoration"
    selected-class="text-primary"
    mandatory 
    filter 
  >
    <v-chip
      v-for="deco in decorationTypes"
      :key="deco"
      :value="deco"
      rounded="sm" 
      class="mr-2 mb-2"
    >
      {{ deco }}
    </v-chip>
  </v-chip-group>
</v-col>
<v-col cols="12" sm="3">
  <v-select
    v-model="house_info.available"
    :items="[
      { title: '是', value: 1 },
      { title: '否', value: 0 }
    ]"
    label="是否随时看房"
    variant="outlined"
    density="comfortable"
    class="rounded-lg"
    hide-details
    color="primary"
  />
</v-col>
<v-col cols="12" sm="3">
  
  <v-select
    v-model="house_info.subway"
    :items="[
      { title: '是', value: 1 },
      { title: '否', value: 0 }
    ]"
    label="是否近地铁"
    variant="outlined"
    density="comfortable"
    class="rounded-lg"
    hide-details
    color="primary"
  />
</v-col>
<v-col cols="12" sm="3">
 
  <v-select
    v-model="house_info.direction"
    label="房屋朝向"
    :items="orientations"
    color="primary"
    variant="outlined"
    density="compact"
    placeholder="选择朝向"
    hide-details
  ></v-select>
</v-col>
  <v-col cols="12" sm="3">
    <v-label class="font-weight-medium mb-2">面积 (㎡)</v-label>
    <v-text-field
      v-model.number="house_info.area"
      color="primary"
      variant="outlined"
      density="compact"
      type="number"
      placeholder="房屋面积"
      suffix="㎡"
      hide-details
      min="0"
    />
  </v-col>
  <v-col cols="12" sm="3">
  <v-label class="font-weight-medium mb-2">楼栋/期</v-label>
  <v-text-field
    v-model="house_info.block"
    color="primary"
    variant="outlined"
    density="compact"
    type="text"
    placeholder="例如 A栋 / 一期"
    hide-details
  />
</v-col>
<v-col cols="12" sm="3">
  <v-label class="font-weight-medium mb-2">所在区域</v-label>
  <v-select
    v-model="house_info.region"
    :items="availableRegions"
    item-title="text"
    item-value="value"
    color="primary"
    variant="outlined"
    density="compact"
    placeholder="选择区域"
    hide-details
  ></v-select>
</v-col>
<v-col cols="12" sm="3">
  <v-label class="font-weight-medium mb-2">租赁方式</v-label>
  <v-chip-group
    v-model="house_info.rent_type"
    selected-class="text-primary"
    mandatory
    filter
  >
    <v-chip v-for="rt in rentTypes" :key="rt" :value="rt" rounded="sm" class="mr-2 mb-2">{{ rt }}</v-chip>
  </v-chip-group>
</v-col>
<v-col cols="12" sm="12">
  <v-label class="font-weight-medium mb-2">房屋设施（可多选）</v-label>
  <v-select
    v-model="selectedAmenityKeysForSelect"
    :items="allAmenities"
    item-title="label" 
    item-value="key"   
    label="选择设施"
    multiple
    chips
    closable-chips
    clearable
    variant="outlined"
    density="compact"
    placeholder="请选择房屋设施"
  >
   
    <template v-slot:chip="{ props, item }">
      <v-chip
        v-bind="props"
        :prepend-icon="item.raw.icon"
        :text="item.raw.label"
      ></v-chip>
    </template>

   
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :title="undefined"> 
        <template v-slot:prepend>
          <v-icon :icon="item.raw.icon" class="mr-3"></v-icon>
        </template>
        <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</v-col>

</v-row>
          </v-card-text>
          <v-divider></v-divider>
          
          
          <v-card-actions class="pa-5">
            <div style="max-width: 304px">
            <div class="g-recaptcha   " :data-sitekey="recaptchaSiteKey"></div>
            </div>
            <v-spacer></v-spacer>
            <v-btn @click="bypassCaptcha">

            </v-btn >
            <v-btn
              class="px-5"
              @click="uploadNewHouse()"
              color="primary"
              elevation="1"
              variant="elevated"
              size="x-large"
            >
              更新房源！</v-btn
            >
          </v-card-actions>
        </v-card>
    </v-col>
    
    <v-col cols="12"> 
      <v-file-input
        v-model="filesFromInput"
        @update:modelValue="processNewFiles(filesFromInput)"
        color="primary"
        counter
        label="选择房源详情图片"
        accept="image/png, image/jpeg, image/bmp, image/webp"
        multiple
        placeholder="点击选择或拖拽图片到此处"
        prepend-icon="mdi-image-multiple-outline"
        variant="solo"
        @click:clear="clearFiles"
        :show-size="1000"
      >
        <template v-slot:selection="{ fileNames }">
          
          <template v-if="fileNames.length > 0">
            <template v-for="(fileName, index) in fileNames.slice(0, 3)" :key="fileName">
              <v-chip color="primary" label size="small" class="me-2">
                {{ fileName }}
              </v-chip>
            </template>
            <span v-if="fileNames.length > 3" class="text-overline text-grey-darken-3 mx-2">
              +{{ fileNames.length - 3 }} 个文件
            </span>
          </template>
          <span v-else-if="allRawFiles.length > 0 && filesFromInput.length === 0" class="text-subtitle-2 text-grey-darken-1">
            已添加 {{ allRawFiles.length }} 个文件。可继续选择或清空。
          </span>
          <span v-else class="text-subtitle-2 text-grey-darken-1">
            未选择文件
          </span>
        </template>
      </v-file-input>
    </v-col>
    </v-row>
    <v-sheet
      v-if="allProcessedFileInfos.length === 0"
      class="d-flex align-center justify-center text-center"
      min-height="60vh"
      rounded="lg"
      border
    >
      <div>
        <AnimationUpload :size="250" /> 
        <h3 class="text-h5 text-md-h4 font-weight-bold text-blue-grey-darken-1 mt-6">
          更新您的房源详情图片
        </h3>
        <p class="text-body-1 text-blue-grey-lighten-1 mt-2">
          支持多张图片同时预览和上传，默认第一张是封面
        </p>
      </div>
    </v-sheet>

    
    <v-sheet v-else rounded="lg" border>
      <perfect-scrollbar class="view pa-3 pa-md-5"> 
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="fileInfo in allProcessedFileInfos"
            :key="fileInfo.key" 
          >
            <v-card elevation="2" class="fill-height d-flex flex-column">
              <v-img
                height="200" 
                :src="fileInfo.link"
                cover 
                class="align-end text-white"
              >
                <v-card-title class="d-flex justify-end pa-1">
                  <v-btn
                    icon
                    density="comfortable"
                    color="error"
                    variant="elevated" 
                    @click="removeImage(fileInfo)"
                  >
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top">移除图片</v-tooltip>
                  </v-btn>
                </v-card-title>
              </v-img>
              <v-divider></v-divider>
              <div class="d-flex flex-column pa-3 flex-grow-1">
                <h5 class="text-subtitle-1 font-weight-bold text-truncate" :title="fileInfo.name">
                  {{ fileInfo.name }}
                </h5>
                <h6 class="text-caption text-grey-darken-1">
                  {{ fileInfo.suffix?.toUpperCase() }} {{ fileInfo.imageSize }}
                </h6>
                <v-spacer></v-spacer> 
                <div class="mt-2">
                  <v-chip
                    color="primary"
                    size="small"
                    label
                    variant="tonal"
                  >
                    {{ fileInfo.type }}
                  </v-chip>
                  <v-chip
                    color="secondary"
                    size="small"
                    label
                    variant="tonal"
                    class="ms-1"
                  >
                    {{ fileInfo.size }}
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </perfect-scrollbar>
    </v-sheet>
  </v-container>
</template>

<style scoped lang="scss">
.view {
  
}

.v-card.fill-height {
  display: flex;
  flex-direction: column;
}
.v-card.fill-height .v-card-text, .v-card.fill-height > .pa-3 { // if v-card-text is used
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>