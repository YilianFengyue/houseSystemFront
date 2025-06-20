<!--
* @Component: UserManagementPage
* @Maintainer: J.K. Yang
* @Description: 用户管理页面
-->
<script setup lang="ts">
import axios from 'axios';
import CopyLabel from "@/components/common/CopyLabel.vue";

// 用户类型定义
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  addr: string;
  avatarUrl: string | null;
  identityCard: string;
  userType: number;
  collect_id: string;
  seen_id: string;
}

const loading = ref(true);
const totalRows = ref(0);
const deleteDialog = ref(false);
const selectedUser = ref<User | null>(null);

// 搜索和分页选项
const queryOptions = reactive({
  query: "",
  page: 1,
  per_page: 10,
});

// 表格头部定义
const headers = ref([
  { title: "用户ID", key: "id", width: "80px" },
  { title: "头像", key: "avatarUrl", width: "80px" },
  { title: "用户名", key: "name" },
  { title: "邮箱", key: "email", width: "200px" },
  { title: "电话", key: "phone", width: "150px" },
  { title: "地址", key: "addr", width: "200px" },
  { title: "身份证", key: "identityCard", width: "180px" },
  { title: "用户类型", key: "userType", width: "100px" },
  { title: "操作", key: "actions", width: "120px", sortable: false },
]);

const usersList = ref<User[]>([]);
const filteredUsersList = ref<User[]>([]);
//路由
import { useRouter } from 'vue-router';
const router = useRouter();

const goUserManage  = () => router.push('/userManage');
const goTestManage2 = () => router.push('/testManagePage2');
// 获取所有用户
const getUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:5000/user/getAllUsers');
    if (response.data.code === 200) {
      usersList.value = response.data.data;
      totalRows.value = usersList.value.length;
      filterUsers();
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    snackbar.show = true;
    snackbar.message = '获取用户列表失败';
    snackbar.color = 'error';
  } finally {
    loading.value = false;
  }
};

// 客户端搜索过滤
const filterUsers = () => {
  if (!queryOptions.query) {
    filteredUsersList.value = usersList.value;
  } else {
    const query = queryOptions.query.toLowerCase();
    filteredUsersList.value = usersList.value.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      user.addr.toLowerCase().includes(query)
    );
  }
};

// 监听搜索查询变化
watch(() => queryOptions.query, () => {
  filterUsers();
});

// 分页处理
const paginatedUsers = computed(() => {
  const start = (queryOptions.page - 1) * queryOptions.per_page;
  const end = start + queryOptions.per_page;
  return filteredUsersList.value.slice(start, end);
});

// 更新分页选项
const onUpdateOptions = (options: any) => {
  queryOptions.per_page = options.itemsPerPage;
  queryOptions.page = options.page;
};

// 打开删除确认对话框
const confirmDelete = (user: User) => {
  selectedUser.value = user;
  deleteDialog.value = true;
};

// 删除用户
const deleteUser = async () => {
  if (!selectedUser.value) return;
  
  try {
    const response = await axios.delete(`http://localhost:5000/user/${selectedUser.value.id}`);
    if (response.data.code === 200) {
      snackbar.show = true;
      snackbar.message = response.data.message;
      snackbar.color = 'success';
      deleteDialog.value = false;
      // 重新获取用户列表
      await getUsers();
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    snackbar.show = true;
    snackbar.message = '删除用户失败';
    snackbar.color = 'error';
  }
};

// 获取用户类型标签
const getUserTypeLabel = (type: number) => {
  switch(type) {
    case 1: return { text: '普通用户', color: 'blue' };
    case 2: return { text: '房东', color: 'green' };
    case 3: return { text: '管理员', color: 'purple' };
    default: return { text: '未知', color: 'grey' };
  }
};

// 格式化身份证号（脱敏）
const formatIdCard = (idCard: string) => {
  if (!idCard || idCard.length < 6) return idCard || '未填写';
  const len = idCard.length;
  const prefix = idCard.substring(0, 3);
  const suffix = idCard.substring(Math.max(len - 3, 3));
  return `${prefix}${'*'.repeat(Math.max(len - 6, 0))}${suffix}`;
};

// Snackbar 通知
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

// 页面加载时获取数据
onMounted(() => {
  getUsers();
});
</script>

<template>
  <div class="pa-5">
    <v-card>
      <v-card-title class="font-weight-bold">
        <span>
          <v-icon class="mr-2">mdi-account-group</v-icon>
          用户管理
        </span>
        <v-spacer></v-spacer>

        <div class="w-25">
         
          <v-text-field
            v-model="queryOptions.query"
            variant="solo"
            prepend-inner-icon="mdi-magnify"
            label="搜索用户"
            single-line
            hide-details
            clearable
            density="compact"
          ></v-text-field>
        </div>
         <v-btn color="primary" variant="elevated" @click="goUserManage">
                进入
                <v-icon end>mdi-arrow-right</v-icon>
         </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="paginatedUsers"
          :loading="loading"
          :items-per-page="queryOptions.per_page"
          :items-length="filteredUsersList.length"
          item-value="id"
          @update:options="onUpdateOptions"
          fixed-header
          height="700"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="font-weight-bold">{{ item.id }}</td>
              <td>
                <v-avatar size="35">
                  <v-img 
                    v-if="item.avatarUrl" 
                    :src="item.avatarUrl" 
                    alt="avatar"
                  />
                  <v-icon v-else size="35" color="grey">
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </td>
              <td class="font-weight-medium">
                <CopyLabel :text="item.name" />
              </td>
              <td>
                <CopyLabel :text="item.email" />
              </td>
              <td>{{ item.phone || '未填写' }}</td>
              <td>{{ item.addr || '未填写' }}</td>
              <td class="text-body-2">{{ formatIdCard(item.identityCard) }}</td>
              <td>
                <v-chip
                  size="small"
                  :color="getUserTypeLabel(item.userType).color"
                  class="font-weight-bold"
                >
                  {{ getUserTypeLabel(item.userType).text }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(item)"
                  :disabled="item.userType === 3"
                  title="删除用户"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>

          <!-- 空状态 -->
          <template v-slot:no-data>
            <div class="text-center py-5">
              <v-icon size="48" color="grey">mdi-account-off</v-icon>
              <p class="text-grey mt-2">暂无用户数据</p>
            </div>
          </template>

          <!-- 加载状态 -->
          <template v-slot:loading>
            <v-skeleton-loader
              v-for="i in 5"
              :key="i"
              type="table-row"
              class="mx-auto"
            ></v-skeleton-loader>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="error">mdi-alert</v-icon>
          确认删除
        </v-card-title>
        <v-card-text>
          确定要删除用户 
          <strong>{{ selectedUser?.name }}</strong> 
          (ID: {{ selectedUser?.id }}) 吗？此操作不可撤销。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteUser"
          >
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar 通知 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<style lang="scss" scoped>
// 保持与原作者一致的样式风格
:deep(.v-data-table) {
  .v-data-table__tr {
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>