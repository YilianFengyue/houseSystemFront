
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
          text: "商品类型",
          link: "/product",
          icon: "mdi-view-dashboard-outline",
        },
        {
          text: "房源管理",
          link: "/landlord",
          icon: "mdi-home-outline",
        },
        {
          text: "新闻管理",
          link: "/news",
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
