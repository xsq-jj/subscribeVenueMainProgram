import { request } from './request'
import type { SportCategory, Venue } from '@/types/domain'

export type HomeData = {
  city: string
  banners: Array<{
    id: number
    title: string
    subTitle: string
    type: string
  }>
  categories: SportCategory[]
  recommendVenues: Venue[]
}

export function getHomeData() {
  return request<HomeData>({
    url: '/app/sport/home/data'
  })
}
