import { request } from './request'
import type { Venue, VenueSlot } from '@/types/domain'

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

export function getVenuePage(query: VenuePageQuery) {
  const queryString = toQuery(query)
  return request<{
    list: Venue[]
    pagination: {
      page: number
      size: number
      total: number
    }
  }>({
    url: `/app/sport/venue/page${queryString ? `?${queryString}` : ''}`
  })
}

export function getVenueInfo(id: number) {
  return request<Venue>({
    url: `/app/sport/venue/info?id=${id}`
  })
}

export function getVenueSlots(venueId: number, date: string) {
  return request<VenueSlot[]>({
    url: `/app/sport/venue/slots?venueId=${venueId}&date=${date}`
  })
}
