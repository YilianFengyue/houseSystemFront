# 房屋租赁系统前端

#### 1、项目基于Vue+Vuetify+Vite;

#### 2、本项目基于 LUX-UI项目 进行修改,运用UI构建页面

#### 简要结构说明

**顶部可以直接搜索文件**

> #### MainAppBar.Vue
>
> ![image-20250517142629325](C:\Users\123\Desktop\SoftWareEngineering\房屋租赁系统\houseSystemFront\assets\image-20250517142629325.png)

> #### ToolBarUser.vue
>
> <img src="C:\Users\123\Desktop\SoftWareEngineering\房屋租赁系统\houseSystemFront\assets\image-20250517142708777.png" alt="image-20250517142708777" style="zoom:33%;" />

> #### 侧边菜单：MainSideBar.vue
>
> <img src="C:\Users\123\Desktop\SoftWareEngineering\房屋租赁系统\houseSystemFront\assets\image-20250517142821064.png" alt="image-20250517142821064" style="zoom:50%;" />

#### 菜单模块说明

```vue
<!-- ---------------------------------------------- -->
    <!---Nav List -->
    <!-- ---------------------------------------------- -->

    <main-menu :menu="navigation.menu"></main-menu>
```

##### 引用菜单组件mainmenu,在Navigation文件夹

Mainmenu自行研究（ai）一下就知道结构了~

##### navigation.vue(映射的路由地址)在这里加选项，点击会跳转对应地址

```ts
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
```

Router/index.ts

```ts
{
    path: "/",
    redirect: "/dashboard",
    meta: {},
  } as any,
```

#### 映射路由地址（访问路径）
