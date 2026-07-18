import { request } from './request'
import type { SportCategory, Venue, VenueSlot } from '@/types/domain'

export type VenuePageQuery = {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
  sort?: 'recommend' | 'price' | 'distance'
}

function toQuery(query: VenuePageQuery) {
  return Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
}

type ApiVenue = Partial<Venue> & {
  categoryId?: number
  city?: string
  cover?: string
  availableText?: string
  monthlySales?: number | string
  minPrice?: number | string
  score?: number | string
  reviewCount?: number
  tags?: string[] | null
}

type ApiVenueSlot = {
  id: number
  inventoryId?: number
  venueId?: number
  courtId?: number
  courtName?: string
  date?: string
  slotDate?: string
  start?: string
  end?: string
  startTime?: string
  endTime?: string
  price?: number | string
  availableStock?: number
  status?: string
}

type ApiCategory = Partial<SportCategory> & {
  id: number
  name: string
}

const tagTypeMap = ['green', 'blue', 'orange', 'purple']

export function normalizeCategory(item: ApiCategory): SportCategory {
  return {
    id: Number(item.id),
    name: item.name,
    icon: item.icon || '',
    color: item.color || '#10B981'
  }
}

export function normalizeVenue(item: ApiVenue): Venue {
  const tags = Array.isArray(item.tags) ? item.tags : []
  const tagTypes = item.tagTypes?.length ? item.tagTypes : tags.map((_, index) => tagTypeMap[index % tagTypeMap.length])
  const monthlySales = Number(item.monthlySales || 0)

  return {
    id: Number(item.id || 0),
    categoryId: item.categoryId === undefined ? undefined : Number(item.categoryId),
    name: item.name || '未命名场馆',
    cover: item.cover || '/static/images/venue-basketball.png',
    score: Number(item.score || 5),
    district: item.district || '',
    address: item.address || '',
    distance: item.distance || '附近',
    tags,
    tagTypes,
    todayAvailableText: item.todayAvailableText || item.availableText || '今日可约',
    minPrice: Number(item.minPrice || 0),
    monthlySales: typeof item.monthlySales === 'string' ? item.monthlySales : monthlySales ? `${monthlySales}+` : '0',
    city: item.city,
    reviewCount: item.reviewCount,
    businessHours: item.businessHours,
    availableText: item.availableText,
    specs: item.specs,
    images: item.images,
    courts: item.courts
  }
}

export function normalizeVenueSlot(item: ApiVenueSlot): VenueSlot {
  const status = String(item.status || '').toUpperCase()

  return {
    id: Number(item.inventoryId || item.id),
    inventoryId: Number(item.inventoryId || item.id),
    venueId: item.venueId === undefined ? undefined : Number(item.venueId),
    courtId: item.courtId === undefined ? undefined : Number(item.courtId),
    courtName: item.courtName,
    date: item.date || item.slotDate,
    start: item.start || item.startTime || '',
    end: item.end || item.endTime || '',
    price: Number(item.price || 0),
    availableStock: item.availableStock,
    status: status === 'SOLD_OUT' ? 'soldOut' : status === 'LOCKED' ? 'locked' : 'available'
  }
}

export function getVenuePage(query: VenuePageQuery) {
  const queryString = toQuery(query)
  return request<{
    list: ApiVenue[]
    pagination: {
      page: number
      size: number
      total: number
    }
  }>({
    url: `/app/sport/venue/page${queryString ? `?${queryString}` : ''}`
  }).then(result => ({
    ...result,
    list: result.list.map(normalizeVenue)
  }))
}

export function getVenueInfo(id: number) {
  return request<ApiVenue>({
    url: `/app/sport/venue/info?id=${id}`
  }).then(normalizeVenue)
}

export function getVenueSlots(venueId: number, date: string) {
  return request<ApiVenueSlot[]>({
    url: `/app/sport/venue/slots?venueId=${venueId}&date=${date}`
  }).then(list => list.map(normalizeVenueSlot))
}
