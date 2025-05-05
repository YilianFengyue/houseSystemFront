<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { on } from "events";
const fetchItems = async () => {
    const res = await axios.get("/sdApi/item");
    itemsList.value = res.data.data;
};
const itemsList =ref<any[]>( [
    {
      itemid: "EST-1",
      productid: "FI-SW-01",
      listprice: 16.50,
      actions: 10.00,
    },
    {
      itemid: "EST-2",
      productid: "FI-SW-02",
      listprice: 20.00,
      actions: 15.00,
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
    console.log(`Added ${item.productid} to cart!`);
  };
  onMounted(() => {
    fetchItems();
  });
</script>

<template>
  <v-data-table :items="itemsList" :headers="headers" hide-default-footer>
    <template v-slot:item.actions="{ item }">
      <v-btn @click="addToCart(item)" color="primary" variant="outlined">
        Add to Cart
      </v-btn>
    </template>
  </v-data-table>
</template>
