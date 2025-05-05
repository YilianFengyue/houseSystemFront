// stores/cartStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { useProfileStore } from '@/stores/profileStore';
//存储token
import {userTokenStore} from "@/stores/token";

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as Array<{
      itemid: string;
      productid: string;
      quantity: number;
      listprice: string;
      totalcost: string;
    }>,
  }),
  getters: {
    // 总价计算：每项数量 * 单价
    cartTotal(state) {
      return state.cartItems.reduce((sum, item) => {
        return sum + item.quantity * parseFloat(item.listprice);
      }, 0);
    },
  },
  actions: {
    getTotalPrice() {
      return this.cartItems.reduce((sum, item) => {
        return sum + item.quantity * parseFloat(item.listprice);
      }, 0);
    },
    async submitCart() {
        const profileStore = useProfileStore();
        const userid = profileStore.getUserId(); 
        const tokenStore = userTokenStore();
        const token = tokenStore.token;
        console.log("token:", token);
        console.log('userid:', userid);
        console.log('isLoggedIn:', tokenStore.isLoggedIn)
        try {
          for (const item of this.cartItems) {
            const payload = {
              userid,
              itemid: item.itemid,
              productid: item.productid,
              description: '',
              instock: '',
              quantity: String(item.quantity),
              listprice: String(item.listprice),
              totalcost: String(item.quantity * parseFloat(item.listprice)),
              address: '',
              times: '',
            };
            console.log(tokenStore.token);
            // await axios.post('sdApi/shoppingcart/addition', payload);
            await axios.post('sdApi/shoppingcart/addition', payload, {
                headers: {
                  Authorization: `${tokenStore.token}`, // 加 token
                },
              });
          }
  
          this.clearCart();
          // alert('购物车已提交！');
        } catch (error) {
          console.error('提交购物车失败:', error);
          alert('提交失败，请重试');
        }
      },
    addToCart(item: { itemid: string; productid: string; quantity: number; listprice: string; totalcost: string }) {
      // 检查购物车中是否已经有该商品
      const existingItem = this.cartItems.find(cartItem => cartItem.itemid === item.itemid);
      if (existingItem) {
        // 如果商品已经存在，增加数量
        existingItem.quantity += 1;
        existingItem.totalcost = (existingItem.quantity * parseFloat(existingItem.listprice)).toFixed(2);
      } else {
        // 如果商品不在购物车中，添加新商品
        this.cartItems.push(item);
      }
    },
     // 清空购物车
    clearCart() {
        this.cartItems = []; // 清空购物车
    },
  },
});
