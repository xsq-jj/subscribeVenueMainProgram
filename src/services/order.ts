import { request } from './request'
import type { SportOrder } from '@/types/domain'

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

export function previewOrder(data: OrderPreviewParams) {
  return request({
    url: '/app/sport/order/preview',
    method: 'POST',
    data
  })
}

export function createOrder(data: CreateOrderParams) {
  return request<SportOrder, CreateOrderParams>({
    url: '/app/sport/order/create',
    method: 'POST',
    data,
    loading: true
  })
}

export function getOrderPage(status?: string) {
  return request<{
    list: SportOrder[]
    pagination: {
      page: number
      size: number
      total: number
    }
  }>({
    url: `/app/sport/order/page${status ? `?status=${status}` : ''}`
  })
}

export function getOrderInfo(id: number) {
  return request<SportOrder>({
    url: `/app/sport/order/info?id=${id}`
  })
}

export function cancelOrder(id: number) {
  return request({
    url: '/app/sport/order/cancel',
    method: 'POST',
    data: { id },
    loading: true
  })
}
