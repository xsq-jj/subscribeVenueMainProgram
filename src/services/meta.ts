import { request } from './request'
import type { CityRegion } from '@/types/domain'

type ApiRegion = {
  id: number
  city: string
  name: string
  count?: number
  venueCount?: number
}

export type HotSearchWord = {
  keyword: string
  heat: number
}

type ApiHotSearchWord = string | Partial<HotSearchWord>

export function getCityRegions(city?: string) {
  return request<ApiRegion[]>({
    url: `/app/sport/meta/regions${city ? `?city=${encodeURIComponent(city)}` : ''}`,
    needAuth: false
  }).then(list =>
    list.map(item => ({
      id: Number(item.id),
      city: item.city,
      name: item.name,
      count: Number(item.count ?? item.venueCount ?? 0)
    }))
  )
}

export function getHotSearchWords() {
  return request<ApiHotSearchWord[]>({
    url: '/app/sport/meta/hot-search',
    needAuth: false
  }).then(list =>
    list.map(item => {
      if (typeof item === 'string') {
        return { keyword: item, heat: 0 }
      }

      return {
        keyword: item.keyword || '',
        heat: Number(item.heat || 0)
      }
    }).filter(item => item.keyword)
  )
}
