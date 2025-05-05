import { defineStore } from "pinia";

export const useProfileStore = defineStore({
  id: "userProfile",
  state: () => ({
    basic: {
      username: "Ylfmoonn",
      realname: "yang J. K.",
      email: "yjkabko@gmail.com",
      avatar:
        "https://avatars.githubusercontent.com/u/181093978?v=4",
      location: "Tokyo,Japan",
      role: "Admin",
      disabled: false,
      about: "Full Stack Developer",
      lastSignIn: "2023-03-29T01:11:13Z",
    },
    account: {
      userid: "Ylfmoonn",
      email: "lapu2023@outlook.com",
      firstname: "ylf",
      lastname: "moonn",
      addr1: "901 Changsha",
      addr2: "411 Nanyang",
      city: "Luoyang",
      state: "Henan",
      zip: "473400",
      country: "China",
      phone: "1380000381",
    },
    signon:{
      username:"Ylfmoonn",
      password:"sfm12345",
      githubUuid:"181093978",
      avatarUrl:"https://avatars.githubusercontent.com/u/181093978?v=4",
    },
    authorized: {
      google: false,
      facebook: false,
    },
    notifications: {
      officialEmails: true,
      followerUpdates: true,
    },
  }),
  actions: {
    getUserId(): string {
      return this.account?.userid || this.signon?.username || 'anonymous';
    },
    getProfile() {
      return {
        basic: this.basic,
        authorized: this.authorized,
        notifications: this.notifications,
      };
    },
    // 一次性设置完整 profile 对象（从后端接口获取后的数据）
    setProfileFromVO(vo: any) {
      const {
        userid,
        email,
        firstname,
        lastname,
        addr1,
        addr2,
        city,
        state,
        zip,
        country,
        phone,
        username,
        password,
        githubUuid,
        avatarUrl,
      } = vo;

      this.account = {
        userid,
        email,
        firstname,
        lastname,
        addr1,
        addr2,
        city,
        state,
        zip,
        country,
        phone,
      };

      this.signon = {
        username,
        password,
        githubUuid,
        avatarUrl,
      };
    },
    // update Basic Info
    updateBasicInfo(info) {
      this.basic = { ...this.basic, ...info };
    },
    // update Authorized
    updateAuthorizedStatus(service, status) {
      this.authorized[service] = status;
    },
    // Update Notifications
    updateNotificationSettings(settings) {
      this.notifications = { ...this.notifications, ...settings };
    },
  },
});
