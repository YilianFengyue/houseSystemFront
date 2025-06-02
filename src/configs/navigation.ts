
import menuLanding from "./menus/landing.menu";
import menuUI from "./menus/ui.menu";
import menuPages from "./menus/pages.menu";
import { text } from "stream/consumers";

export default {
  menu: [
    {
      text: "",
      items: [
        {
          text: "主页",
          link: "/dashboard",
          icon: "mdi-view-dashboard-outline",
        },
        {
          text: "搜索列表",
          link: "/houseList",
          icon: "mdi-format-list-bulleted",
        },
        {
          text: "商品类型",
          link: "/house",
          icon: "mdi-view-dashboard-outline",
        },
        {
          text: "管理员界面",
          link: "/admin",
          icon: "mdi-android-studio",
        },
        {
          text: "房源管理",
          link: "/landlord",
          icon: "mdi-home-outline",
        },
        {
          text: "房源上传",
          link: "/landlordUpload",
          icon: "mdi-home-outline",
        },
        {
          text: "新闻管理",
          link: "/news",
          icon: "mdi-newspaper",
        },
        {
          text: "新闻编辑",
          link: "/newsEditor",
          icon: "mdi-file-document-edit-outline",
        },
        {
          text: "测试页面",
          link: "/testIndexPage1",
          icon: "mdi-newspaper",
        },
        {
          text: "测试管理页面2",
          link: "/testManagePage",
          icon: "mdi-newspaper",
        },
        {
          text: "测试管理页面3",
          link: "/testManagePage2",
          icon: "mdi-newspaper",
        },
        {
          icon: "mdi-robot-excited-outline",
          text: "AI选购顾问",
          link: "/ai/chatbot_v1",
        },
        {
          icon: "mdi-robot-outline",
          text: "Image Bot",
          link: "/image-bot",
        },
      ],
    },

    // {
    //   text: "Landing",
    //   items: [
    //     ...menuLanding,

    //   ],
    // },
    // {
    //   text: "UI - Theme Preview",
    //   items: menuUI,
    // },
    // {
    //   text: "Pages",
    //   items: menuPages,
    // },

  ],
};
