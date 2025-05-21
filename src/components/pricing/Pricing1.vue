<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
const pricing_plans = [
  {
    plan_name: "短期租用",
    price: "原价",
    storage: "单人",
    features: ["适合短期（1-6个月）内需要租房的用户，欢迎您的支持"],
  },
  // {
  //   plan_name: "高级版",
  //   price: "每月29元",
  //   storage: "100GB",
  //   features: ["100GB云存储", "专属客户支持", "高级安全功能", "高速文件传输"],
  // },
  {
    plan_name: "中期租用",
    price: "每月9折",
    storage: "单人",
    features: [
      "相对较长时间（6个月-12个月）租用的用户，欢迎您的支持"
    ],
  },
  {
    plan_name: "长期租用",
    price: "每月8折",
    storage: "单人",
    features: [
      "相对特长时间租用的用户，欢迎您的支持"
    ],
  },
];
</script>

<template>
  <v-card class="my-5" rounded color="grey-50">
    <v-card-title class="card-title">Details Below</v-card-title>
    <v-divider></v-divider>
    <div class="pa-10">
      <v-card
        max-width="1600"
        class="mx-auto"
        variant="flat"
        color="transparent"
      >
        <v-item-group mandatory selected-class="active-card">
          <v-row align="stretch">
            <v-col cols="12" md="4" v-for="plan in pricing_plans">
              <v-item v-slot="{ isSelected, selectedClass, toggle }">
                <v-card
                  :theme="isSelected ? 'dark' : 'light'"
                  elevation="0"
                  height="100%"
                  class="base-card text-center mx-auto pa-10 pa-md-15 d-flex flex-column justify-center"
                  :class="selectedClass"
                  @click="toggle"
                >
                  <div>
                    <h3 class="font-weight-bold text-h5 mt-5 mb-10">
                      {{ plan.plan_name }}
                    </h3>
                    <h1 class="font-weight-black text-h3 mt-5 mb-10">
                      <span class="text-primary">{{ plan.price }}</span>
                    </h1>

                    <div class="text-h6 font-weight-bold mb-10">
                      {{ plan.storage }}
                    </div>
                    <div>
                      <div v-for="feature in plan.features">{{ feature }}</div>
                    </div>

                    <v-btn color="primary" size="large" class="mt-10"
                      >pay now！</v-btn
                    >
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.base-card {
  transition: 0.3s ease-out;
}

.active-card {
  border: 1px solid #e5e5e5;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
  transition: 0.3s ease-out;
}
</style>
