<script setup lang="ts">
import { useTheme } from "vuetify";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import { Icon } from "@iconify/vue";
import axios from "axios";
interface Color {
  colorId: number;
  colorName: string;
  colorValue: string;
}
const customizeTheme = useCustomizeThemeStore();
const theme = useTheme();
const themeDrawer = computed({
  get: () => customizeTheme.themeDrawer,
  set: (val) => customizeTheme.themeDrawer = val,
});
const currentColor = ref<Color>({
  colorId: 2,
  colorName: "grey",
  colorValue: "#344767",
});
const primaryColors = ref([
  {
    colorId: 2,
    colorName: "grey",
    colorValue: "#344767",
  },
]);
//购物车
import { useCartStore } from '@/stores/cartStore';
const cartStore = useCartStore();  // 使用购物车 store
const cartitems =cartStore.cartItems;
const cartTotal = computed(() => cartStore.cartTotal);

//订单
const editedItem = ref({
  userid: "ACID",
  orderdate: "2024-11-04T16:00:00.000+00:00",
  shipaddr1: "901 San Antonio Road",
  shipaddr2: "MS UCUP02-206",
  shipcity: "Palo Alto",
  shipstate: "CA",
  shipzip: "94303",
  shipcountry: "USA",
  billaddr1: "901 San Antonio Road",
  billaddr2: "MS UCUP02-206",
  billcity: "Palo Alto",
  billstate: "CA",
  billzip: "94303",
  billcountry: "USA",
  courier: "USA",
  totalprice: 193.50,
  billtofirstname: "ABC",
  billtolastname: "XYX",
  shiptofirstname: "ABC",
  shiptolastname: "XYX",
  creditcard: "999 9999 9999 9999",
  exprdate: "12/03",
  cardtype: "Visa",
  locale: "CA"
});
import { useProfileStore } from "@/stores/profileStore";


import {userTokenStore} from "@/stores/token";

const profileStore = useProfileStore();  // 使用购物车 store
const account = reactive({ ...profileStore.account });
const proceedToPay = () => {
  cartStore.submitCart(); // 提交购物车

  // 从用户信息中填入姓名
  const { account } = profileStore;
  editedItem.value.userid = account.userid;
  editedItem.value.billtofirstname = account.firstname;
  editedItem.value.billtolastname = account.lastname;
  editedItem.value.shiptofirstname = account.firstname;
  editedItem.value.shiptolastname = account.lastname;
  console.log(editedItem.value);
  // 填入购物车总价

  // 打开订单确认对话框
  detailDialog.value = true;
};
const detailDialog = ref(false)

const save = async () => {
  try {
    // const response = await axios.post('/sdApi/orders', editedItem.value);
    const tokenStore = userTokenStore(); // 使用token store
    const response = await axios.post(
      '/sdApi/orders',
      editedItem.value,
      {
        headers: {
          Authorization: tokenStore.token, // 或者加上前缀：`Bearer ${tokenStore.token}`
        }
      }
    );
    if (response.data.code === 20011) {
      // 成功提示 + 关闭对话框
      console.log('订单提交成功');
      detailDialog.value = false;
    } else {
      console.error('订单提交失败');
    }
  } catch (err) {
    console.error('提交出错', err);
  }
};
onMounted(() => updatePrimaryColor(customizeTheme.primaryColor));

watch(currentColor, (newVal) => {
  updatePrimaryColor(newVal)
});

const updatePrimaryColor = (newColor: Color) => {
  theme.themes.value.light.colors.primary = newColor.colorValue;
  theme.themes.value.dark.colors.primary = newColor.colorValue;
  customizeTheme.setPrimaryColor(newColor);
  currentColor.value = newColor;

}
</script>

<template>
  <div>
    <!-- <div class="drawer-button" @click="themeDrawer = true">
      <v-icon class="text-white">mdi-cog-outline</v-icon>
    </div> -->

    <v-navigation-drawer
      v-model="themeDrawer"
      location="right"
      temporary
      width="500"
      class="theme-drawer"
    >
      <div class="pa-5">
        <div class="top-area">
          <div class="d-flex align-center">
            <h1><b>ShoppingCart</b></h1>
            <v-spacer></v-spacer>
          </div>
          <div>See our items options.</div>
        </div>

        <hr class="my-6" />
        <div class="theme-area">
          <!-- <b>Global Theme Mode</b> -->
          <v-data-table
            :items="cartitems"
            hide-default-footer
            :pagination="false">
          </v-data-table>

        </div>
        <hr class="my-6" />
        <hr class="my-6" />
        <div class="">
          <h2><b>TotalPrice:¥{{ cartTotal.toFixed(2) }}</b></h2>

        </div>
        <hr class="mb-6" />
        <div>
          <v-btn color="" class="gradient info" block size="large"
          @click="proceedToPay">
            Proceed To Checkout</v-btn
          >
        </div>
        <div class="ml-5 mt-5 d-flex align-center">
          <v-icon color="primary" class="mr-6">mdi-email-outline</v-icon>
          <a href="mailto:yjkbako@gmail.com">yjkbako@gmail.com</a>
        </div>

      </div>
    </v-navigation-drawer>



    <v-dialog
                v-model="detailDialog"
                persistent
                max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">订单确认</span>
            </v-card-title>
            <!-- 编辑卡片 -->
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                          cols="12"
                          sm="6"
                          md="6"
                  >
                  <v-select
                    label="Card Type"
                    :items="['Visa', 'MasterCard', 'American Express']"
                    v-model="editedItem.cardtype"
                  ></v-select>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="6"
                  >
                    <v-text-field
                            v-model="editedItem.creditcard"
                            label="Card Number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="4"
                  >
                    <v-text-field
                            v-model="editedItem.billtofirstname"
                            disabled
                            label="First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="4"
                  >
                    <v-text-field
                            v-model="editedItem.billtolastname"
                            disabled
                            label="Last Name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="4"
                  >
                    <v-text-field
                            v-model="editedItem.exprdate"
                            label="Expiry Date (MM/YYYY):"
                    ></v-text-field>
                  </v-col>

                  <v-col
                          cols="12"
                          sm="6"
                          md="3"
                  >
                    <v-text-field
                            v-model="editedItem.billaddr1"
                            label="Address 1"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="3"
                  >
                  <v-text-field
                            v-model="editedItem.billaddr2"
                            label="Address 2"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="3"
                  >
                    <v-text-field
                            v-model="editedItem.shipcity"
                            label="City"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="3"
                  >
                    <v-text-field
                            v-model="editedItem.shipstate"
                            label="State"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="4"
                  >
                    <v-text-field
                            v-model="editedItem.shipzip"
                            label="Zip"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="4"
                  >
                    <v-text-field
                            v-model="editedItem.shipcountry"
                            label="Country"
                    ></v-text-field>
                  </v-col>
                  <v-col
                          cols="12"
                          sm="6"
                          md="4"
                  >
                    <v-text-field
                            v-model="editedItem.totalprice"
                            disabled
                            label="Total Price"
                    >${{cartTotal.toFixed(2)}}</v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                      color="blue darken-1"
                      text
                      @click="detailDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
              >
                Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  background-color: #705cf6;
  top: 340px;
  right: -45px;
  z-index: 999;
  padding: 0.5rem 1rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  box-shadow: 1px 1px 9px #705cf6;
  transition: all 0.5s;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 18px #705cf6;
    right: 0px;
    transition: all 0.5s;
  }

  .v-icon {
    font-size: 1.3rem;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

hr {
  background-image: linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 0.4),
    transparent
  ) !important;
  background-color: transparent;
  opacity: 0.25;
  border: none;
  height: 1px;
}
</style>
