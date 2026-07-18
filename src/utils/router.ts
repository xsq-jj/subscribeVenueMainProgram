import { ROUTES, isTabRoute } from '@/config/routes'

type NavigateOptions = {
  failToast?: string
}

function isCurrentPage(url: string) {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  if (!current) {
    return false
  }
  return `/${current.route}` === url.split('?')[0]
}

export function navigateTo(url: string, options: NavigateOptions = {}) {
  if (isTabRoute(url)) {
    goTab(url)
    return
  }

  uni.navigateTo({
    url,
    fail: () => {
      if (options.failToast) {
        uni.showToast({ title: options.failToast, icon: 'none' })
      }
    }
  })
}

export function redirectTo(url: string, options: NavigateOptions = {}) {
  if (isTabRoute(url)) {
    goTab(url)
    return
  }

  uni.redirectTo({
    url,
    fail: () => {
      if (options.failToast) {
        uni.showToast({ title: options.failToast, icon: 'none' })
      }
    }
  })
}

export function goTab(url: string) {
  if (isCurrentPage(url)) {
    return
  }

  uni.switchTab({ url: url.split('?')[0] })
}

export function goBack(fallbackUrl = ROUTES.TAB_HOME) {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
    return
  }

  if (isTabRoute(fallbackUrl)) {
    goTab(fallbackUrl)
    return
  }

  redirectTo(fallbackUrl)
}

export function goAuthProfile() {
  goTab(ROUTES.TAB_PROFILE)
}
