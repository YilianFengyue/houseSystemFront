<template>
    <v-row align="center" justify="center" dense>
    <v-col cols="12" md="12">
        <v-card class="mx-auto" >
          <v-row no-gutters>
            <!-- 左侧图片 -->
            <v-col cols="12" md="3">
              <v-img
                :width="300"
                aspect-ratio="4/3"
                cover
                src="https://vrlab-image4.ljcdn.com/release/screenshot/auto3d-AReQywDjwglmk3gtxKgKh3/dac83378584bc581fb0db1a7d5527201/1742962065_7/pc0_UdLeKAt5n.jpg?imageMogr2/quality/70/thumbnail/1024x"
              ></v-img>
            </v-col>

            <!-- 右侧内容 -->
            <v-col cols="12" md="9" class="d-flex flex-column justify-center pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-map</v-icon>
                满五唯一红本在手 品牌装修自住 <v-chip color="red">必看好房</v-chip>
                <v-spacer />
                <v-icon class="ms-2">mdi-check</v-icon>
              </v-card-title>
              <v-card-subtitle>万科魅力之城武广新城</v-card-subtitle>
              <v-card-text >
                3室2厅 | 96.89平米 | 东 | 精装 | 34层 | 板塔结合<br/>
                <br/>
                1人关注 / 1个月以前发布
              </v-card-text>
              <v-card-text >
                <v-chip color="red" variant="outlined">必看好房</v-chip>   <v-chip color="green" variant="outlined">随时看房</v-chip>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
    </v-col>
    <v-col cols="12" md="12">
        <v-card class="mx-auto" >
          <v-row no-gutters>
            <!-- 左侧图片 -->
            <v-col cols="12" md="3">
              <v-img
                :width="300"
                aspect-ratio="4/3"
                cover
                src="https://vrlab-image4.ljcdn.com/release/screenshot/auto3d-AReQywDjwglmk3gtxKgKh3/dac83378584bc581fb0db1a7d5527201/1742962065_7/pc0_UdLeKAt5n.jpg?imageMogr2/quality/70/thumbnail/1024x"
              ></v-img>
            </v-col>

            <!-- 右侧内容 -->
            <v-col cols="12" md="9" class="d-flex flex-column justify-center pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-map</v-icon>
                满五唯一红本在手 品牌装修自住 <v-chip color="red">必看好房</v-chip>
                <v-spacer />
                <v-icon class="ms-2">mdi-check</v-icon>
              </v-card-title>
              <v-card-subtitle>万科魅力之城武广新城</v-card-subtitle>
              <v-card-text >
                3室2厅 | 96.89平米 | 东 | 精装 | 34层 | 板塔结合<br/>
                <br/>
                1人关注 / 1个月以前发布
              </v-card-text>
              <v-card-text >
                <v-chip color="red" variant="outlined">必看好房</v-chip>   <v-chip color="green" variant="outlined">随时看房</v-chip>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
    </v-col>
      <v-col cols="12" md="12">
        <v-card
          class="mx-auto"
          subtitle="prepend and append"
          title="Icons"
        >
          <template v-slot:prepend>
            <v-icon color="primary" icon="mdi-account"></v-icon>
          </template>
          <template v-slot:append>
            <v-icon color="success" icon="mdi-check"></v-icon>
          </template>
          <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</v-card-text>
        </v-card>
      </v-col>
  
      <v-col cols="12" md="12">
        <v-card
          append-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
          class="mx-auto"
          prepend-avatar="https://cdn.vuetifyjs.com/images/logos/v-alt.svg"
          subtitle="prepend-avatar and append-avatar"
          title="Avatars"
        >
          <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</v-card-text>
        </v-card>
      </v-col>
  
      <v-col cols="12" md="12">
        <v-card
          class="mx-auto"
          subtitle="prepend and append"
          title="Avatars"
        >
          <template v-slot:prepend>
            <v-avatar color="blue-darken-2">
              <v-icon icon="mdi-alarm"></v-icon>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-avatar size="24">
              <v-img
                alt="John"
                src="https://cdn.vuetifyjs.com/images/john.png"
              ></v-img>
            </v-avatar>
          </template>
          <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>