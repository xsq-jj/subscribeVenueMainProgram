const STORAGE_PREFIX = 'SPORT_BOOKING'

export const STORAGE_KEYS = {
  TOKEN: 'TOKEN',
  USER_PROFILE: 'USER_PROFILE'
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

function appKey(key: StorageKey) {
  return `${STORAGE_PREFIX}:${key}`
}

export function getStorage<T>(key: StorageKey, fallback: T): T {
  try {
    const value = uni.getStorageSync(appKey(key))
    return value === '' || value === undefined || value === null ? fallback : (value as T)
  } catch {
    return fallback
  }
}

export function setStorage<T>(key: StorageKey, value: T) {
  try {
    uni.setStorageSync(appKey(key), value)
  } catch {
    // Storage failure should not break the visible user flow.
  }
}

export function removeStorage(key: StorageKey) {
  try {
    uni.removeStorageSync(appKey(key))
  } catch {
    // Ignore storage cleanup failures.
  }
}

export function getLegacyStorage<T>(key: string, fallback: T): T {
  try {
    const value = uni.getStorageSync(key)
    return value === '' || value === undefined || value === null ? fallback : (value as T)
  } catch {
    return fallback
  }
}

export function removeLegacyStorage(key: string) {
  try {
    uni.removeStorageSync(key)
  } catch {
    // Ignore storage cleanup failures.
  }
}
