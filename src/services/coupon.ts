import { request } from './request'
import type { CouponStatus, UserCoupon } from '@/types/domain'

type ApiCoupon = {
  description?: string
  theme?: string
}

type ApiUserCoupon = {
  id: number
  couponId?: number
  name?: string
  title?: string
  type?: string
  thresholdAmount?: number | string
  discountAmount?: number | string
  discountRate?: number | string
  validEndTime?: string
  status?: number | string
  coupon?: ApiCoupon
}

function statusText(status?: number | string): CouponStatus {
  if (Number(status) === 1) return 'USED'
  if (Number(status) === 2) return 'EXPIRED'
  return 'AVAILABLE'
}

function themeText(theme?: string): UserCoupon['theme'] {
  return theme === 'purple' || theme === 'orange' ? theme : 'green'
}

function valueText(item: ApiUserCoupon) {
  if (item.type === 'discount') {
    const rate = Number(item.discountRate || 1)
    return `${Number((rate * 10).toFixed(1))}折`
  }

  return `¥${Number(item.discountAmount || 0)}`
}

function thresholdText(item: ApiUserCoupon) {
  const amount = Number(item.thresholdAmount || 0)
  return amount > 0 ? `满${amount}元可用` : '无门槛'
}

function expireText(value?: string) {
  if (!value) return '长期有效'
  const text = String(value).slice(0, 10).replace(/-/g, '.')
  return `${text} 到期`
}

export function normalizeCoupon(item: ApiUserCoupon): UserCoupon {
  return {
    id: Number(item.id),
    couponId: Number(item.couponId || item.id),
    title: item.title || item.name || '优惠券',
    description: item.coupon?.description || '运动场馆可用',
    valueText: valueText(item),
    thresholdText: thresholdText(item),
    expireText: expireText(item.validEndTime),
    status: statusText(item.status),
    theme: themeText(item.coupon?.theme),
    amount: Number(item.discountAmount || 0),
    discountRate: Number(item.discountRate || 1)
  }
}

export function getMyCoupons() {
  return request<ApiUserCoupon[]>({
    url: '/app/sport/coupon/my'
  }).then(list => list.map(normalizeCoupon))
}
