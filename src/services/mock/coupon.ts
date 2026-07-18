import type { UserCoupon } from '@/types/domain'

export const coupons: UserCoupon[] = [
  {
    id: 1,
    title: '新用户立减券',
    description: '全场运动场馆通用',
    valueText: '¥20',
    thresholdText: '满100可用',
    expireText: '有效期至 2025-02-16',
    status: 'AVAILABLE',
    theme: 'green'
  },
  {
    id: 2,
    title: '周末运动满减券',
    description: '限周末及节假日使用',
    valueText: '¥30',
    thresholdText: '满200可用',
    expireText: '有效期至 2025-03-31',
    status: 'AVAILABLE',
    theme: 'purple'
  },
  {
    id: 3,
    title: '黄金会员专享折扣',
    description: '限篮球、羽毛球场馆，最高减50元',
    valueText: '8.5折',
    thresholdText: '不限门槛',
    expireText: '有效期至 2025-06-30',
    status: 'AVAILABLE',
    theme: 'orange'
  },
  {
    id: 4,
    title: '工作日早场券',
    description: '仅限工作日 12:00 前使用',
    valueText: '¥15',
    thresholdText: '满80可用',
    expireText: '已使用',
    status: 'USED',
    theme: 'green'
  },
  {
    id: 5,
    title: '老客回归券',
    description: '限指定场馆使用',
    valueText: '¥25',
    thresholdText: '满150可用',
    expireText: '已过期',
    status: 'EXPIRED',
    theme: 'purple'
  }
]
