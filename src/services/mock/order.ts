import type { SportOrder } from '@/types/domain'
import { designImages } from './assets'

export const orders: SportOrder[] = [
  {
    id: 1,
    orderNo: 'YD20250116001',
    status: 'WAIT_USE',
    venueName: '奥体中心篮球馆',
    venueCover: designImages.orderBasketball,
    dateText: '2025年1月16日 周四',
    timeText: '14:00-16:00',
    courtName: '3号场地',
    amount: 140
  },
  {
    id: 2,
    orderNo: 'YD20250110003',
    status: 'COMPLETED',
    venueName: '朝阳羽毛球馆',
    venueCover: designImages.orderBadminton,
    dateText: '2025年1月10日 周五',
    timeText: '10:00-12:00',
    courtName: '2号场地',
    amount: 120
  },
  {
    id: 3,
    orderNo: 'YD20250108005',
    status: 'CANCELLED',
    venueName: '海淀网球中心',
    venueCover: designImages.orderTennis,
    dateText: '2025年1月8日 周三',
    timeText: '16:00-18:00',
    courtName: '1号场地',
    amount: 200
  }
]
