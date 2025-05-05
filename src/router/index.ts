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
    path: "/product",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/ProcuctPage.vue"),
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
    path: '/oauth/callback',
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import('@/views/auth/OauthCallBack.vue'),
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
