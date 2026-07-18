import { request } from './request'
import type { SportCategory, Venue } from '@/types/domain'
import { normalizeCategory, normalizeVenue } from './venue'

export type HomeData = {
  city: string
  banners: Array<{
    id: number
    title: string
    subTitle: string
    image?: string
    type: string
    targetUrl?: string
  }>
  categories: SportCategory[]
  recommendVenues: Venue[]
}

export function getHomeData() {
  return request<{
    city: string
    banners: HomeData['banners']
    categories: Array<Partial<SportCategory> & { id: number; name: string }>
    recommendVenues: Array<Partial<Venue>>
  }>({
    url: '/app/sport/home/data'
  }).then(result => ({
    ...result,
    categories: result.categories.map(normalizeCategory),
    recommendVenues: result.recommendVenues.map(normalizeVenue)
  }))
}
