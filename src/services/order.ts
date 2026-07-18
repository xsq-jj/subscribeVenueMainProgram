import { request } from './request'
import type { OrderStatus, SportOrder } from '@/types/domain'

export type OrderPreviewParams = {
  inventoryIds: number[]
  couponId?: number
}

export type CreateOrderParams = OrderPreviewParams & {
  contactName: string
  contactPhone: string
  remark?: string
  mockPaid?: boolean
}

export type OrderPreviewResult = {
  totalAmount: number
  discountAmount: number
  payAmount: number
  details: Array<{ label: string; amount: number }>
}

type ApiOrderItem = {
  id: number
  inventoryId: number
  venueId?: number
  courtId: number
  courtName?: string
  slotDate: string
  startTime: string
  endTime: string
  price: number | string
  amount?: number | string
}

type ApiOrder = {
  id: number
  orderNo: string
  status: string
  venueId?: number
  venueName?: string
  venueCover?: string
  venueAddress?: string
  venueSnapshot?: {
    name?: string
    cover?: string
    address?: string
  }
  slotDate?: string
  startTime?: string
  endTime?: string
  courtNames?: string
  totalAmount?: number | string
  discountAmount?: number | string
  payAmount?: number | string
  contactName?: string
  contactPhone?: string
  items?: ApiOrderItem[]
}

function isOrderStatus(status: string): status is OrderStatus {
  return ['WAIT_PAY', 'WAIT_USE', 'COMPLETED', 'CANCELLED'].includes(status)
}

function formatDateText(date?: string) {
  if (!date) return ''

  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) return date

  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const week = weekNames[new Date(year, month - 1, day).getDay()]
  return `${year}年${month}月${day}日 ${week}`
}

export function normalizeOrder(item: ApiOrder): SportOrder {
  const firstItem = item.items?.[0]
  const lastItem = item.items?.[item.items.length - 1]
  const date = item.slotDate || firstItem?.slotDate
  const startTime = item.startTime || firstItem?.startTime || ''
  const endTime = item.endTime || lastItem?.endTime || ''
  const status = isOrderStatus(item.status) ? item.status : 'WAIT_PAY'

  return {
    id: Number(item.id),
    orderNo: item.orderNo,
    status,
    venueId: item.venueId,
    date,
    slotId: firstItem?.inventoryId,
    venueName: item.venueName || item.venueSnapshot?.name || '预约场馆',
    venueCover: item.venueCover || item.venueSnapshot?.cover || '/static/images/venue-basketball.png',
    venueAddress: item.venueAddress || item.venueSnapshot?.address,
    dateText: formatDateText(date),
    timeText: startTime && endTime ? `${startTime}-${endTime}` : '',
    courtName: item.courtNames || firstItem?.courtName || '',
    amount: Number(item.payAmount ?? item.totalAmount ?? 0),
    totalAmount: Number(item.totalAmount ?? 0),
    discountAmount: Number(item.discountAmount ?? 0),
    payAmount: Number(item.payAmount ?? 0),
    contactName: item.contactName,
    contactPhone: item.contactPhone,
    items: item.items?.map(orderItem => ({
      ...orderItem,
      price: Number(orderItem.price || 0),
      amount: Number(orderItem.amount ?? orderItem.price ?? 0)
    }))
  }
}

export function previewOrder(data: OrderPreviewParams) {
  return request<OrderPreviewResult, OrderPreviewParams>({
    url: '/app/sport/order/preview',
    method: 'POST',
    data
  })
}

export function createOrder(data: CreateOrderParams) {
  return request<ApiOrder, CreateOrderParams>({
    url: '/app/sport/order/create',
    method: 'POST',
    data,
    loading: true
  }).then(normalizeOrder)
}

export function getOrderPage(status?: string) {
  return request<{
    list: ApiOrder[]
    pagination: {
      page: number
      size: number
      total: number
    }
  }>({
    url: `/app/sport/order/page${status ? `?status=${status}` : ''}`
  }).then(result => ({
    ...result,
    list: result.list.map(normalizeOrder)
  }))
}

export function getOrderInfo(id: number) {
  return request<ApiOrder | null>({
    url: `/app/sport/order/info?id=${id}`
  }).then(item => (item ? normalizeOrder(item) : null))
}

export function cancelOrder(id: number) {
  return request<ApiOrder, { id: number }>({
    url: '/app/sport/order/cancel',
    method: 'POST',
    data: { id },
    loading: true
  }).then(normalizeOrder)
}

export function payOrder(id: number) {
  return request<ApiOrder, { id: number }>({
    url: '/app/sport/order/pay',
    method: 'POST',
    data: { id },
    loading: true
  }).then(normalizeOrder)
}

export function completeOrder(id: number) {
  return request<ApiOrder, { id: number }>({
    url: '/app/sport/order/complete',
    method: 'POST',
    data: { id },
    loading: true
  }).then(normalizeOrder)
}
