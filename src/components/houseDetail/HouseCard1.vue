
<script setup lang="ts"></script>

<template>
  <v-card class="my-5" rounded>
    <v-card-title class="card-title">Feature4</v-card-title>
    <v-divider></v-divider>
    <div style="width: 80%; margin: 0 auto;" class="pa-5">
      <v-row no-gutters align="stretch">
        <v-col cols="12" md="8">
          <v-card height="50%">
                <v-carousel>
                <v-carousel-item
                    src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                    cover
                ></v-carousel-item>

                <v-carousel-item
                    src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
                    cover
                ></v-carousel-item>

                <v-carousel-item
                    src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                    cover
                ></v-carousel-item>
                </v-carousel>
          </v-card>
                    <v-card
                class="my-5"
                prepend-icon="$vuetify"
                subtitle="The #1 Vue UI Library"
               height="30%"
            >
                <template v-slot:title>
                <span class="font-weight-black">Welcome to Vuetify</span>
                </template>

                <v-card-text class="bg-surface-light pt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card
            color="white"
            elevation="0"
            height="100%"
            class="mx-auto pa-5 pa-sm-10 pa-md-15"
          >
            <RouterLink to="/" class="text-primary">10251元/平米</RouterLink>
            <h1 class="font-weight-black text-h3 mt-5 mb-10">
              <span class="text-red">108.4万</span>
              your startup
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
              impedit error labore doloremque fugit! Dolor fugit molestiae vero
              quos quisquam nobis, eos debitis magni omnis ea incidunt amet
              voluptate dignissimos!
            </p>
            <h2 class="text-h6 mt-4 mx-auto">Premium Design</h2>
            <div class="my-5 ml-5">
              <li>Lifetime Updates</li>
              <li>Quality Support</li>
              <li>Easy to build websites</li>
            </div>

            <h2 class="text-h6 mt-4 mx-auto my-5">Building your project</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis
              cupiditate totam, quae deleniti voluptate alias, doloribus
              doloremque qui corporis veritatis aspernatur harum. Expedita,
              blanditiis, nostrum eveniet consequatur porro quae, delectus
              ratione nam minus fugit odit quas dolore voluptatum! Molestiae, id
              voluptate. Ullam ut ratione iste quibusdam blanditiis itaque
              cupiditate totam dolor quisquam praesentium, ad necessitatibus
              beatae, doloremque fugiat esse repellendus nulla error sequi illo
              nihil sit eos asperiores expedita ducimus? Nisi quasi eius in,
              nobis modi cum numquam quibusdam sint. Ad vitae expedita dolores
              repudiandae ea laborum voluptatem, perferendis at corrupti fuga!
              Placeat sunt molestias eos quo corrupti omnis laborum?
            </p>

            <v-row class="mt-5">
              <v-col cols="12" sm="6">
                <v-btn block height="60" class="text-white mr-5" color="primary"
                  >Get Stack</v-btn
                >
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn variant="outlined" block height="60" class="text-primary"
                  >Watch Demo</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped lang="scss"></style>
