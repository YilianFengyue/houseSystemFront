import menuLanding from "./menus/landing.menu";
import menuUI from "./menus/ui.menu";
import menuPages from "./menus/pages.menu";

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
    // 如果你需要保留这些菜单组，可以取消注释
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