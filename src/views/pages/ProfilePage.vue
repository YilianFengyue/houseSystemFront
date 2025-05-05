<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->

<script setup lang="ts">
import { useProfileStore } from "@/stores/profileStore";
import { Icon } from "@iconify/vue";
const profileStore = useProfileStore();
//相关信息
const newpassword = ref("");
const confirmPassword = ref("");
const account = reactive({ ...profileStore.account });
const signon = reactive({ ...profileStore.signon });
const authorized = reactive({
  google: false,
  facebook: false,
});

const notifications = reactive({
  officialEmails: false,
  followerUpdates: false,
});

const passwords = reactive({
  currentPassword: "123456",
  newPassword: "",
  confirmPassword: "",
});

const currentPasswordShow = ref(false);
const newPasswordShow = ref(false);
const confirmPasswordShow = ref(false);

onMounted(() => {
  
});
</script>

Basic with Icons
<template>
  <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <div class="d-flex flex-column pa-10">
            <v-avatar size="120" class="mx-auto elevation-12" color="white">
              <v-img :src="signon.avatarUrl"> </v-img>
            </v-avatar>

            <div class="text-center mt-5">
              <h3 class="text-h6 font-weight-bold">
                {{signon.username}}
                <v-chip size="small" class="font-weight-bold" color="blue">
                  User
                </v-chip>
              </h3>
              <p class="text-body-2">Costumer of Petstore</p>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-map-marker </v-icon>
            <span class="ml-4">{{ account.city }}</span>
          </div>

          <v-divider></v-divider>
          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-email-check-outline </v-icon>
            <span class="ml-4">{{ account.email }}</span>
          </div>
          <v-divider></v-divider>

          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-phone-outline </v-icon>
            <span class="ml-4">{{account.phone}}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <!-- ---------------------------------------------- -->
        <!--   Basic Infomation -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            Basic Infomation
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">Username</v-label>
                <v-text-field
                  v-model="account.userid"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="Your Name"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="">
                <v-label class="font-weight-medium mb-2">Firstname</v-label>
                <v-text-field
                  v-model="account.firstname"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">Lastname</v-label>
                <v-text-field
                  v-model="account.lastname"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">Email</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  v-model="account.email"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">Addr1</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  v-model="account.addr1"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">Addr2</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"

                  v-model="account.addr2"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">City</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  
                  v-model="account.city"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">Country</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  
                  v-model="account.country"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">Zip</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  
                  v-model="account.zip"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
              <v-col cols="12" sm="3">
                <v-label class="font-weight-medium mb-2">Phone</v-label>
                <v-text-field
                  class="bg-blue-grey-lighten-5"
                  
                  v-model="account.phone"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  type="text"
                  placeholder="John Deo"
                  hide-details
              /></v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
            >
              Unpdate Basic Info</v-btn
            >
          </v-card-actions>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Authentication  -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            Authentication</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" md="6">
                <v-btn
                 
                  size="large"
                  block
                  variant="outlined"
                  disabled
                >
                  <Icon
                    icon="logos:google-icon"
                    class="mr-3 my-2"
                  />Google</v-btn
                >
              </v-col>

              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon
                    icon="logos:facebook"
                    class="mr-3 my-2"
                  />Facebook</v-btn
                >
              </v-col>

              <v-col cols="12" md="6">
                <v-btn size="large" block variant="elevated"
                 color="primary"
                  
                >
                  <Icon
                    icon="logos:github-icon"
                    class="mr-3 my-2"
                  />Github</v-btn
                >
              </v-col>
              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon icon="logos:twitter" class="mr-3 my-2" />Twitter</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Change Password  -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            Change Password
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2"
                  >Current Password</v-label
                >
                <v-text-field
                  readonly
                  v-model="signon.password"
                  class="bg-blue-grey-lighten-5"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  :type="currentPasswordShow ? 'text' : 'password'"
                  placeholder="Current Password"
                  hide-details
                  :append-inner-icon="
                    currentPasswordShow ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="
                    currentPasswordShow = !currentPasswordShow
                  "
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6"> </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">Password</v-label>
                <v-text-field
                  v-model="newpassword"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  :type="newPasswordShow ? 'text' : 'password'"
                  placeholder="new password"
                  hide-details
                  :append-inner-icon="
                    newPasswordShow ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="newPasswordShow = !newPasswordShow"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2"
                  >Confirm Password</v-label
                >
                <v-text-field
                  v-model="confirmPassword"
                  density="compact"
                  color="primary"
                  variant="outlined"
                  :type="confirmPasswordShow ? 'text' : 'password'"
                  placeholder="confirm password"
                  hide-details
                  :append-inner-icon="
                    confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append-inner="
                    confirmPasswordShow = !confirmPasswordShow
                  "
                >
                </v-text-field
              ></v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
            >
              Unpdate Password</v-btn
            >
          </v-card-actions>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Notifications  -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="py-4 font-weight-bold">
            Notifications</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <div>
              <v-switch
                v-model="notifications.officialEmails"
                color="primary"
                class="mr-4"
                hide-details
                label=" Receive newsletters, promotions and news from lux"
              ></v-switch>
            </div>
            <div>
              <v-switch
                v-model="notifications.followerUpdates"
                color="primary"
                class="mr-4"
                hide-details
                label=" Notify me when someone I follow uploads new workx"
              ></v-switch>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              class="px-5"
              color="primary"
              elevation="1"
              variant="elevated"
            >
              Unpdate Notifications</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
