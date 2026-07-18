import { appEnv } from '@/config/env'
import { clearAuthToken, getAuthToken } from '@/utils/auth'
import { goAuthProfile } from '@/utils/router'

type RequestOptions<T = unknown> = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: T
  loading?: boolean
  needAuth?: boolean
}

type ApiResponse<T> = {
  code?: number
  data?: T
  message?: string
}

export type ApiError = {
  code: number
  message: string
  raw?: unknown
}

let redirectingToAuth = false

function createApiError(code: number, message: string, raw?: unknown): ApiError {
  return { code, message, raw }
}

function handleUnauthorized() {
  clearAuthToken()
  void import('@/stores/user')
    .then(({ useUserStore }) => {
      useUserStore().logout()
    })
    .catch(() => {
      // 401 兜底不能反过来影响请求错误处理。
    })

  if (redirectingToAuth) {
    return
  }

  redirectingToAuth = true
  uni.showToast({ title: '请先在我的页面完成授权', icon: 'none' })
  setTimeout(() => {
    goAuthProfile()
    redirectingToAuth = false
  }, 300)
}

function getRequestUrl(url: string) {
  if (/^https?:\/\//.test(url)) {
    return url
  }

  if (!appEnv.apiBaseUrl) {
    return url
  }

  return `${appEnv.apiBaseUrl}${url}`
}

export function request<T = unknown, D = unknown>(options: RequestOptions<D>): Promise<T> {
  if (options.loading) {
    uni.showLoading({ title: '加载中', mask: true })
  }

  const header: Record<string, string> = {}
  if (options.needAuth !== false) {
    const token = getAuthToken()
    if (token) {
      header.Authorization = token
    }
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: getRequestUrl(options.url),
      method: options.method || 'GET',
      data: options.data,
      timeout: 15000,
      header,
      success: res => {
        const data = res.data as ApiResponse<T>

        if (res.statusCode === 401) {
          handleUnauthorized()
          reject(createApiError(401, '登录已失效', res))
          return
        }

        if (data && typeof data === 'object' && 'code' in data) {
          if (data.code === 1000 || data.code === 0) {
            resolve(data.data as T)
            return
          }

          const message = data.message || '请求失败'
          uni.showToast({ title: message, icon: 'none' })
          reject(createApiError(data.code || res.statusCode, message, data))
          return
        }

        resolve(res.data as T)
      },
      fail: err => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(createApiError(-1, '网络异常', err))
      },
      complete: () => {
        if (options.loading) {
          uni.hideLoading()
        }
      }
    })
  })
}
