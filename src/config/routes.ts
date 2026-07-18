export const ROUTES = {
  TAB_HOME: '/pages/tabbar/home/index',
  TAB_VENUE: '/pages/tabbar/venue/index',
  TAB_ORDER: '/pages/tabbar/order/index',
  TAB_PROFILE: '/pages/tabbar/profile/index',
  LOCATION: '/subPackages/common/location/index',
  FAVORITE: '/subPackages/user/favorite/index',
  COUPON: '/subPackages/user/coupon/index',
  SPORT_RECORD: '/subPackages/user/sport-record/index',
  SETTINGS: '/subPackages/user/settings/index',
  PROFILE_INFO: '/subPackages/user/profile-info/index',
  VENUE_SEARCH: '/subPackages/venue/search/index',
  REVIEW_LIST: '/subPackages/venue/review-list/index',
  ORDER_CONFIRM: '/subPackages/order/confirm/index',
  ORDER_SUCCESS: '/subPackages/order/success/index',
  ORDER_DETAIL: '/subPackages/order/detail/index',
  VENUE_DETAIL: '/subPackages/venue/detail/index'
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export const TAB_ROUTES = [
  ROUTES.TAB_HOME,
  ROUTES.TAB_VENUE,
  ROUTES.TAB_ORDER,
  ROUTES.TAB_PROFILE
] as const

export type TabRoutePath = (typeof TAB_ROUTES)[number]

export function isTabRoute(url: string): url is TabRoutePath {
  const path = url.split('?')[0]
  return TAB_ROUTES.includes(path as TabRoutePath)
}

export function withQuery(path: RoutePath, query: Record<string, string | number | boolean | undefined>) {
  const search = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return search ? `${path}?${search}` : path
}

export function venueDetailRoute(id: string | number) {
  return withQuery(ROUTES.VENUE_DETAIL, { id })
}

export function orderDetailRoute(orderId: string | number) {
  return withQuery(ROUTES.ORDER_DETAIL, { orderId })
}

export function orderConfirmRoute(venueId: string | number) {
  return withQuery(ROUTES.ORDER_CONFIRM, { venueId })
}

export function orderSuccessRoute(orderId: string | number) {
  return withQuery(ROUTES.ORDER_SUCCESS, { orderId })
}
