import { request } from './request'
import type { LocalUserProfile } from '@/utils/auth'

export type LoginTokenResult = {
  expire: number
  token: string
  refreshExpire: number
  refreshToken: string
}

export type UserPerson = {
  id: number
  nickName?: string
  avatarUrl?: string
  memberLevel?: string
  phone?: string
  city?: string
}

export function devLogin(phone = '13888888888') {
  return request<LoginTokenResult, { phone: string }>({
    url: '/app/user/login/dev',
    method: 'POST',
    data: { phone },
    needAuth: false
  })
}

export function miniLogin(data: { code: string }) {
  return request<LoginTokenResult, { code: string }>({
    url: '/app/user/login/mini',
    method: 'POST',
    data,
    needAuth: false
  })
}

export function getUserPerson() {
  return request<UserPerson>({
    url: '/app/user/info/person'
  })
}

export function updateUserPerson(data: Partial<UserPerson>) {
  return request<UserPerson, Partial<UserPerson>>({
    url: '/app/user/info/updatePerson',
    method: 'POST',
    data
  })
}

export function toLocalUserProfile(person?: UserPerson): LocalUserProfile {
  return {
    nickName: person?.nickName || '篮球爱好者小王',
    avatar: person?.avatarUrl || '/static/images/user-avatar.png',
    level: person?.memberLevel || '黄金会员'
  }
}
