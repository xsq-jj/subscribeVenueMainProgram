import { STORAGE_KEYS, getLegacyStorage, getStorage, removeLegacyStorage, removeStorage, setStorage } from '@/utils/storage'

const LEGACY_TOKEN_KEY = 'SPORT_TOKEN'

export type LocalUserProfile = {
  nickName: string
  avatar: string
  level: string
}

export const DEFAULT_USER_PROFILE: LocalUserProfile = {
  nickName: '篮球爱好者小王',
  avatar: '/static/images/user-avatar.png',
  level: '黄金会员'
}

export function getAuthToken() {
  return getStorage<string>(STORAGE_KEYS.TOKEN, '') || getLegacyStorage<string>(LEGACY_TOKEN_KEY, '')
}

export function setAuthToken(token: string) {
  setStorage(STORAGE_KEYS.TOKEN, token)
  removeLegacyStorage(LEGACY_TOKEN_KEY)
}

export function clearAuthToken() {
  removeStorage(STORAGE_KEYS.TOKEN)
  removeLegacyStorage(LEGACY_TOKEN_KEY)
}

export function getLocalUserProfile() {
  return getStorage<LocalUserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE)
}

export function setLocalUserProfile(profile: LocalUserProfile) {
  setStorage(STORAGE_KEYS.USER_PROFILE, profile)
}

export function clearLocalUserProfile() {
  removeStorage(STORAGE_KEYS.USER_PROFILE)
}
