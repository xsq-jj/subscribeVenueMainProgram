import { defineStore } from 'pinia'
import { appEnv } from '@/config/env'
import { devLogin, getUserPerson, miniLogin, toLocalUserProfile, type LoginTokenResult } from '@/services/user'
import {
  DEFAULT_USER_PROFILE,
  type LocalUserProfile,
  clearAuthToken,
  clearLocalUserProfile,
  getAuthToken,
  getLocalUserProfile,
  setAuthToken,
  setLocalUserProfile
} from '@/utils/auth'

function getWechatLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: result => {
        if (result.code) {
          resolve(result.code)
          return
        }
        reject(new Error('微信登录未返回 code'))
      },
      fail: reject
    })
  })
}

export const useUserStore = defineStore('user', {
  state: () => {
    const profile = getLocalUserProfile()

    return {
      token: getAuthToken(),
      nickName: profile.nickName,
      avatar: profile.avatar,
      level: profile.level
    }
  },
  getters: {
    isAuthorized: state => Boolean(state.token)
  },
  actions: {
    setToken(token: string) {
      this.token = token
      setAuthToken(token)
    },
    setProfile(profile: LocalUserProfile) {
      this.nickName = profile.nickName
      this.avatar = profile.avatar
      this.level = profile.level
      setLocalUserProfile(profile)
    },
    async authorizeProfile() {
      try {
        let tokenInfo: LoginTokenResult | null = null

        // #ifdef MP-WEIXIN
        const code = await getWechatLoginCode()
        tokenInfo = await miniLogin({ code })
        // #endif

        // #ifndef MP-WEIXIN
        if (appEnv.isDev) {
          tokenInfo = await devLogin()
        }
        // #endif

        if (!tokenInfo?.token) {
          throw new Error('当前平台不支持微信小程序授权')
        }

        this.setToken(tokenInfo.token)

        try {
          const person = await getUserPerson()
          this.setProfile(toLocalUserProfile(person))
        } catch {
          this.setProfile(DEFAULT_USER_PROFILE)
        }

        return true
      } catch {
        return false
      }
    },
    async refreshProfile() {
      try {
        const person = await getUserPerson()
        this.setProfile(toLocalUserProfile(person))
        return true
      } catch {
        return false
      }
    },
    logout() {
      this.token = ''
      this.nickName = DEFAULT_USER_PROFILE.nickName
      this.avatar = DEFAULT_USER_PROFILE.avatar
      this.level = DEFAULT_USER_PROFILE.level
      clearAuthToken()
      clearLocalUserProfile()
    }
  }
})
