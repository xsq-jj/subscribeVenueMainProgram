import { request } from './request'
import { normalizeVenue } from './venue'
import type { Venue } from '@/types/domain'

type FavoriteToggleResult = {
  favorited: boolean
}

export function getFavoriteIds() {
  return request<number[]>({
    url: '/app/sport/favorite/ids'
  }).then(list => list.map(Number))
}

export function getFavoriteList() {
  return request<Array<Partial<Venue> & { id: number }>>({
    url: '/app/sport/favorite/list'
  }).then(list => list.map(normalizeVenue))
}

export function toggleRemoteFavorite(venueId: number) {
  return request<FavoriteToggleResult, { venueId: number }>({
    url: '/app/sport/favorite/toggle',
    method: 'POST',
    data: { venueId }
  })
}
