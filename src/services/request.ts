type RequestOptions<T = unknown> = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: T
  loading?: boolean
}

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

export function request<T = unknown, D = unknown>(options: RequestOptions<D>): Promise<T> {
  if (options.loading) {
    uni.showLoading({ title: '加载中', mask: true })
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseURL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        Authorization: uni.getStorageSync('SPORT_TOKEN') || ''
      },
      success: res => {
        const data = res.data as { code?: number; data?: T; message?: string }
        if (res.statusCode === 401) {
          uni.navigateTo({ url: '/pages/user/login/index' })
          reject(new Error('登录失效'))
          return
        }
        if (data && typeof data === 'object' && 'code' in data) {
          if (data.code === 1000 || data.code === 0) {
            resolve(data.data as T)
          } else {
            uni.showToast({ title: data.message || '请求失败', icon: 'none' })
            reject(data)
          }
          return
        }
        resolve(res.data as T)
      },
      fail: err => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (options.loading) {
          uni.hideLoading()
        }
      }
    })
  })
}
