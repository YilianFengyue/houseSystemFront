<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import configs from "@/configs";
import MainMenu from "@/components/navigation/MainMenu.vue";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import { Icon } from "@iconify/vue";
import { useProfileStore } from "@/stores/profileStore";
import { onMounted, ref, watch } from 'vue';

// 引入不同用户类型的导航配置
import navigationUserType0 from "@/configs/navigation0";
import navigationUserType1 from "@/configs/navigation1";
import navigationUserType2 from "@/configs/navigation2";

const customizeTheme = useCustomizeThemeStore();
const profileStore = useProfileStore();
const userType = ref(profileStore.user.userType);

// 根据用户类型选择导航配置
const getNavigationConfig = () => {
  switch (userType.value) {
    case 0:
      return navigationUserType0;
    case 1:
      return navigationUserType1;
    case 2:
      return navigationUserType2;
    default:
      return {};
  }
};

const navigation = ref(getNavigationConfig());

watch(() => userType.value, () => {
  navigation.value = getNavigationConfig();
});

const openGithubSite = () => {
  window.open("https://github.com/", "_blank");
};

onMounted(() => {
  console.log('User Type:', userType.value);
  scrollToBottom();
});

const scrollToBottom = () => {
  const contentArea = document.querySelector(".v-navigation-drawer__content");
  const activeItem = document.querySelector(
    ".v-list-item--active"
  ) as HTMLElement;

  setTimeout(() => {
    contentArea?.scrollTo({
      top: activeItem?.offsetTop,
    });
  }, 100);
};
</script>

<template>
  <v-navigation-drawer
    border="none"
    elevation="1"
    v-model="customizeTheme.mainSidebar"
    temporary
    id="mainMenu"
  >
    <!-- ---------------------------------------------- -->
    <!---Top Area -->
    <!-- ---------------------------------------------- -->
    <template v-if="!customizeTheme.miniSidebar" v-slot:prepend>
      <v-card
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px 25px 15px -20px"
        height="100"
        class="logo-card"
      >
        <h1 class="logo-text h-full">
          <!-- <Icon class="mr-2" width="40" icon="solar:plain-bold-duotone" /> -->
          <img src="@/assets/logo-house.svg" alt="Logo" width="20" height="20" style="margin-right:10px" />
          <span> 好客租房</span>
        </h1>
      </v-card>
    </template>

    <!-- ---------------------------------------------- -->
    <!---Nav List -->
    <!-- ---------------------------------------------- -->

    <main-menu :menu="navigation.menu"></main-menu>

    <!-- ---------------------------------------------- -->
    <!---Bottom Area -->
    <!-- ---------------------------------------------- -->
    <template v-if="!customizeTheme.miniSidebar" v-slot:append>
      <v-card
        theme="dark"
        height="225"
        class="pa-3"
        variant="text"
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px -25px 15px -20px"
      >
        <v-card
          class="d-flex flex-column gradient pa-2"
          :class="customizeTheme.primaryColor.colorName"
          height="200"
        >
          <v-card-title>
            <v-btn
              class="mr-2"
              size="40"
              color="white"
              :class="`text-${customizeTheme.primaryColor.colorName}`"
              icon
            >
              <Icon width="30" icon="line-md:github-loop" />
            </v-btn>
            Yang J.K.
          </v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text>
            <div><b>Github:</b></div>
            <div>github.com</div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="white"
              block
              prepend-icon="mdi-thumb-up-outline"
              variant="elevated"
              @click="openGithubSite"
            >
              给我点个赞吧
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>

<style  lang="scss">
.gradient-card {

  background: linear-gradient(
    270deg,
    rgba(var(--v-theme-primary), 0.7) 0,
    rgb(var(--v-theme-primary)) 100%
  );
  box-shadow: 0 2px 6px rgba(var(--v-theme-primary), 0.3);
}

.logo-card {
  .logo-text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
    color: rgba(var(--v-theme-primary));
  }
}
</style>