import { createRouter, createWebHistory } from "vue-router";

import LandingRoutes from "./landing.routes";
import AuthRoutes from "./auth.routes";

export const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    meta: {},
  } as any,
  {
    path: "/dashboard",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/DashBoard.vue"),
  },
  {
    path: "/houseList",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/HouseListPage.vue"),
  },
  {
    path: "/testIndexPage1",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/TestIndexPage.vue"),
  },
  {
    path: "/testManagePage",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/TestManagePage.vue"),
  },
  {
    path: "/testManagePage2",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/TestManagePage2.vue"),
  },
  
  {
    path: "/house",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/ProcuctPage.vue"),
  },
  //管理员
  {
    path: "/admin",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/Admin/AdministratorPanel.vue"),
  },
  //富文本编辑器
  {
    path: "/newsEditor",
    component: () => import("@/views/pages/News/editor/RichTextEditorPage.vue"),
    meta: {
      requiresAuth: true,
      layout: "landing",
      category: "Data",
      title: "RichTextEditor",
    },
  },
  {
    path: "/newsList",
    component: () => import("@/views/pages/News/editor/NewsListPage.vue"),
    meta: {
      requiresAuth: true,
      layout: "landing",
      category: "Data",
      title: "NewsList",
    },
  },
  //新闻详情页
  {
    path: "/newsDetail/:id",
    component: () => import("@/views/pages/News/editor/NewsDetailPage.vue"),
    meta: {
      requiresAuth: true,
      layout: "landing",
      category: "Data",
      title: "NewsDetail",
    },
  },
  //房东发布房源界面：
  {
    path: "/landlordUpload",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/landlord/uploadHousePage.vue"),
  },
  {
    path: "/landlordUpdate/:id",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/landlord/updateHousePage.vue"),
  },
  //房东的房源
  {
    path: "/myHouse",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/landlord/MyHouse.vue"),
  },
  {
    path: "/house/:id",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/ProcuctPage.vue"),
  },
    {
    path: "/landlord",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/LandlordProperties.vue"),
  },
  {
    path: "/userManage",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/Admin/UserManagePage.vue"),
  },
    {
    path: "/news",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/NewsPage.vue"),
  },
  {
    path: "/ai/chatbot_v1",
    component: () => import("@/views/chatgpt/ChatBotV1.vue"),
    meta: {
      requiresAuth: true,
      layout: "landing",
      // category: "AI",
      title: "ChatBotV1",
    },
  },
  // image bot
  {
    path: "/image-bot",
    component: () => import("~/src/views/pages/ImageBot.vue"),
    meta: {
      requiresAuth: true,
      layout: "landing",
      // category: "AI",
      // title: "ImageBot",
    },
  },

  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "@/views/pages/ProfilePage.vue"),
    meta: {
      requiresAuth: true,
      layout: "ui",
      title: "Profile",
      category: "Config",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    component: () =>
      import(/* webpackChunkName: "error" */ "@/views/errors/NotFoundPage.vue"),
  },
  // lottie Animation
  {
    path: "/ui/lottie-animation",
    name: "ui-lottie-animation",
    component: () =>
      import(
        /* webpackChunkName: "ui-lottie-animation" */ "@/views/ui/LottieAnimationPage.vue"
      ),
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "UI",
      title: "LottieAnimation",
    },

  },{
      path: "/chat",
      meta: {
        requiresAuth: true,
        layout: "landing",
      },
      component: () => import("@/views/pages/chatpage.vue"),
    },
    {
      path: "/payPay",
      meta: {
        requiresAuth: true,
        layout: "landing",
      },
      component: () => import("@/views/pages/PricingPage.vue"),
    },
    {
      path: "/contract",
      meta: {
        requiresAuth: true,
        layout: "landing",
      },
      component: () => import("@/views/pages/contractpage.vue"),
    },
    {
      path: "/RentHouse",
      meta: {
        requiresAuth: true,
        layout: "landing",
      },
      component: () => import("@/views/pages/AccountRentHouse.vue"),
    },
    {
      path: "/setpassword",
      meta: {
        requiresAuth: true,
        layout: "landing",
      },
      component: () => import("@/views/pages/ResetPassword.vue"),
    },

  ...LandingRoutes,
  ...AuthRoutes,


];


export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHistory(),
  // hash模式：createWebHashHistory，history模式：createWebHistory
  // process.env.NODE_ENV === "production"

  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
