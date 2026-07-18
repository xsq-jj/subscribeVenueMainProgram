import { request } from './request'
import type { OrderStatus, SportRecord } from '@/types/domain'

export type SportRecordStats = {
  count: number
  hours: number
  amount: number
  typeStats: Array<{ type: string; count: number }>
}

export type SportRecordPageQuery = {
  page?: number
  size?: number
  sportType?: string
  month?: string
}

type ApiSportRecord = {
  id: number
  venueId: number
  venueName: string
  sportType: string
  slotDate: string
  startTime: string
  endTime: string
  durationHour: number | string
  amount: number | string
  status?: number | string
}

function toQuery(query: SportRecordPageQuery = {}) {
  return Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
}

function formatDateText(value?: string) {
  if (!value) return ''

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}年${month}月${day}日 ${weekNames[new Date(year, month - 1, day).getDay()]}`
}

function normalizeRecordStatus(status?: number | string): OrderStatus {
  return Number(status) === 3 ? 'CANCELLED' : 'COMPLETED'
}

export function normalizeSportRecord(item: ApiSportRecord): SportRecord {
  return {
    id: Number(item.id),
    venueId: Number(item.venueId),
    venueName: item.venueName,
    sportType: item.sportType,
    slotDate: item.slotDate,
    dateText: formatDateText(item.slotDate),
    timeText: `${item.startTime || ''}-${item.endTime || ''}`,
    durationHour: Number(item.durationHour || 0),
    amount: Number(item.amount || 0),
    status: normalizeRecordStatus(item.status)
  }
}

export function getSportRecordPage(query: SportRecordPageQuery = {}) {
  const queryString = toQuery(query)
  return request<{
    list: ApiSportRecord[]
    pagination: {
      page: number
      size: number
      total: number
    }
  }>({
    url: `/app/sport/record/page${queryString ? `?${queryString}` : ''}`
  }).then(result => ({
    ...result,
    list: result.list.map(normalizeSportRecord)
  }))
}

export function getSportRecordStats(query: Pick<SportRecordPageQuery, 'month'> = {}) {
  const queryString = toQuery(query)
  return request<SportRecordStats>({
    url: `/app/sport/record/stats${queryString ? `?${queryString}` : ''}`
  }).then(result => ({
    count: Number(result.count || 0),
    hours: Number(result.hours || 0),
    amount: Number(result.amount || 0),
    typeStats: result.typeStats || []
  }))
}
