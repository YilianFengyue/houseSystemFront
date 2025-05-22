<template>
  <v-card  class="my-5" rounded>
    <v-card-actions><v-card-title class="card-title text-h5">热门地区</v-card-title>
    <v-spacer></v-spacer>
    <v-btn 
    color="primary">
        <v-icon class="mr-2">mdi-more</v-icon>
        Learn More
    </v-btn>
    </v-card-actions>
    
    <v-divider></v-divider>
      <v-container fluid>
        
        <v-row dense>
          <template v-for="(card, idx) in cards" :key="idx">
            <!-- 普通卡片 -->
            <v-col v-if="!card.children" :cols="card.flex">
              <v-card elevation="16" rounded="0"  hover>
                <v-img
                  :src="card.src"
                  class="align-end"
                
                  height="408px"
                  cover
                >
                  <v-card-title class="text">{{ card.title }}</v-card-title>
                <v-card-subtitle class="text-caption text-white">{{ card.el }}</v-card-subtitle>
                </v-img>
              </v-card>
            </v-col>

            <!-- 嵌套卡片（上下排列） -->
            <v-col v-else :cols="card.flex" class="d-flex flex-column">
              <v-row dense>
                <v-col
                  v-for="(child, cIdx) in card.children"
                  :key="cIdx"
                  :cols="child.flex"
                >
                  <v-card elevation="16" rounded="0">
                    <v-img
                      :src="child.src"
                      class="align-end"
                     
                      height="200px"
                      cover
                    >
                      <v-card-title class="text">{{ child.title }}</v-card-title>
                      <v-card-subtitle class="text-caption text-white">{{child.el}}</v-card-subtitle>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>

</template>

<script setup lang="ts">
const cards = [
  {
    flex: 6,
    children: [
      { title: '岳麓区', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/beijing.jpg?_v=202505081523220', flex:8 ,el:"Beijing"},
      { title: '开福区', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/xuzhou.jpg?_v=202505081523220', flex: 4 ,el:"Xuzhou"},
      { title: '望城区', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/shenzhen.jpg?_v=202505081523220', flex: 4 ,el:"Shenzhen"},
      { title: '天心区', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/chengdu.jpg?_v=202505081523220', flex: 8 ,el:"Chengdu"},
    ],
  },
  { title: '雨花区', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/shanghai.jpg?_v=202505081523220', flex: 3 ,el:"Shanghai"},

  {
    flex: 3,
    children: [
      { title: '芙蓉区', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/guangzhou.jpg?_v=202505081523220', flex: 12, el:"Guangzhou"},
      { title: '长沙县', src: 'https://s1.ljcdn.com/pegasus/pc/asset/main/img/zhengzhou.jpg?_v=202505081523220', flex: 12 ,el:"Zhengzhou"},
    ],
  },
];
</script>
<style lang="css" scoped>
.text {
  color: #fff;
  font-size: 25px;
  font-weight: bold;
  font-family: 'Source Han Sans SC', sans-serif;
}
</style>