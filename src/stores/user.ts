import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('SPORT_TOKEN') || '',
    nickName: '篮球爱好者小王',
    avatar: '/static/images/user-avatar.png',
    level: '黄金会员'
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      uni.setStorageSync('SPORT_TOKEN', token)
    },
    logout() {
      this.token = ''
      uni.removeStorageSync('SPORT_TOKEN')
    }
  }
})
