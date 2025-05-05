<script lang="ts" setup>
const reveal = ref(false)
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import * as live2d from 'live2d-render';
//购物车
import { useCartStore } from '@/stores/cartStore';  // 导入 store
const cartStore = useCartStore();  // 使用购物车 store
//Item相关
function removeHtmlTags(input) {
  return input.replace(/<[^>]+>/g, '');  // 正则表达式去除 HTML 标签
}
const filteredItems = ref<any[]>([]);
const fetchItems = async () => {
    const res = await axios.get("/sdApi/item");
    itemsList.value = res.data.data;
};
const itemsList =ref<any[]>( [
  {
            itemid: "EST-1",
            productid: "FI-SW-01",
            listprice: 16.50,
            unitcost: 10.00,
            supplier: 1,
            status: "P",
            attr1: "Large",
            uploaded: 0
        },
        {
            itemid: "EST-10",
            productid: "K9-DL-01",
            listprice: 18.50,
            unitcost: 12.00,
            supplier: 1,
            status: "P",
            attr1: "Spotted Adult Female",
            uploaded: 0
        },
]);
  const headers = [
    { text: "Product ID", value: "productid" },
    { text: "Item ID", value: "itemid" },
    { text: "List Price", value: "listprice" },
    { text: "Actions", value: "actions" },
  ];
// Add to Cart Function
const addToCart = (item) => {
    cartStore.addToCart({
      itemid: item.itemid,
      productid: item.productid,
      quantity: 1,
      listprice: item.listprice,
      totalcost: item.listprice,
    });
    console.log(`Added ${item.productid} to cart!`);
  };

// import * as live2d from 'live2d-render';
const message= ref("商品界面！~~");


const route = useRoute();

// 切换卡片展开/收起状态
const expandedCards = ref<Set<string>>(new Set()); // 存储展开的卡片ID

const toggleReveal = (item: any) => {
    const id = item.productid;
    console.log(item.productid);
    // 发送 Live2D 消息
    live2d.setMessageBox(`这是 ${item.name}，类别是 ${item.category}`, 3000);

    // 控制卡片展开/收起状态
    if (expandedCards.value.has(id)) {
    expandedCards.value.delete(id);
    } else {
    expandedCards.value.add(id);
    }
    // 根据当前 productid 筛选 item 数据
    filteredItems.value = itemsList.value.filter((item) => item.productid === id);

};
const filteredProducts = ref<any[]>([]);

const fetchProducts = async () => {
    const res = await axios.get("/sdApi/product");
    products.value = res.data.data;
    const catid = route.query.catid as string;
    if (catid) {
        filteredProducts.value = products.value.filter(
        (item) => item.category === catid
        );
    } else {
        filteredProducts.value = products.value;
    }
};
const products =ref<any[]>( [
    {
        productid: "FI-SW-01",
        category: "FISH",
        name: "Angelfish",
        descn1: "./images/fish1.gif"
    },
]);
onMounted(() => {
    fetchProducts();
    fetchItems();
    live2d.setMessageBox(message.value, 3000);
    console.log("Dashboard mounted");
});
</script>
<template>
    <v-container width="1600">
      <v-row align="center">
        <v-col
          cols="12"
          xs="6"
          md="4"
          lg="6"
          xl="2"
          v-for="item in filteredProducts"
          :key="item.productid"
        >
          <v-card class="mx-auto" >
            <v-card-text>

              <!--
              <div class="text-medium-emphasis">
                <v-img cover :src="item.descn1" width="200px"></v-img>
                <v-spacer></v-spacer>
              </div> -->
              <v-card-item title="CutePets Product">
                <template v-slot:subtitle>
                  <v-icon
                    class="me-1 pb-1"
                    color="error"
                    icon="mdi-paw"
                    size="18"
                  ></v-icon>

                  Choose Pet Your Like
                </template>
              </v-card-item>
              <v-row align="center">
              <v-col cols="auto">
                <v-img cover :src="item.descn1" width="200px"></v-img>
              </v-col>
              <v-col>
                <div><p class="text-h5 font-weight-black">{{item.category }}</p></div>
              <p class="text-h4 font-weight-black">{{ item.name }}</p>
              <p>{{ item.productid }}</p>
                <div class="text-medium-emphasis">
                  {{ removeHtmlTags(item.descn) }}
                </div>
              </v-col>
            </v-row>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="teal-accent-4"
                text="Learn More"
                variant="text"
                @click="toggleReveal(item)"
              />
            </v-card-actions>

            <v-expand-transition>
              <v-card
                v-if="expandedCards.has(item.productid)"
                class="position-absolute w-100"
                height="100%"
                style="bottom: 0;"
              >
                <v-card-text class="pb-0">
                  <p class="text-h4">{{ item.name }}</p>
                  <!-- ItemTable,算了不嵌套了 -->
                  <v-data-table
                    :items="filteredItems"
                    :headers="headers"
                    items-per-page="2"
                    hide-default-footer

                  >
                    <template #item.actions="{ item }">
                      <v-btn @click.stop="addToCart(item)" color="primary" variant="outlined">
                        Add to Cart
                      </v-btn>
                    </template>
                  </v-data-table>

                </v-card-text>
                <v-card-actions class="pt-0">
                  <v-btn
                    color="teal-accent-4"
                    text="Close"
                    variant="text"
                    @click="toggleReveal(item)"
                  />
                </v-card-actions>
              </v-card>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
