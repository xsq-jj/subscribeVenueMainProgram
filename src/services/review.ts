import { request } from './request'
import type { VenueReview } from '@/types/domain'

export type ReviewFilter = 'ALL' | 'GOOD' | 'IMAGE' | 'LATEST'

export type ReviewSummary = {
  total: number
  good: number
  withImage: number
  rating?: number
  starCounts?: Record<number, number>
}

export type ReviewPageQuery = {
  page?: number
  size?: number
  venueId?: number
  filter?: ReviewFilter
}

type ApiReview = Partial<VenueReview> & {
  id: number
}

function toQuery(query: ReviewPageQuery = {}) {
  return Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== '' && value !== 'ALL')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
}

export function normalizeReview(item: ApiReview): VenueReview {
  return {
    id: Number(item.id),
    venueId: item.venueId === undefined ? undefined : Number(item.venueId),
    userName: item.userName || '运动用户',
    avatar: item.avatar || '/static/images/user-avatar.png',
    rating: Number(item.rating || 5),
    timeText: item.timeText || '',
    content: item.content || '',
    images: item.images || [],
    likeCount: Number(item.likeCount || 0),
    commentCount: Number(item.commentCount || 0),
    merchantReply: item.merchantReply,
    liked: Boolean(item.liked)
  }
}

export function getReviewPage(query: ReviewPageQuery = {}) {
  const queryString = toQuery(query)
  return request<{
    list: ApiReview[]
    pagination: {
      page: number
      size: number
      total: number
    }
  }>({
    url: `/app/sport/review/page${queryString ? `?${queryString}` : ''}`,
    needAuth: false
  }).then(result => ({
    ...result,
    list: result.list.map(normalizeReview)
  }))
}

export function getReviewSummary(venueId?: number) {
  return request<ReviewSummary>({
    url: `/app/sport/review/summary${venueId ? `?venueId=${venueId}` : ''}`,
    needAuth: false
  }).then(result => ({
    total: Number(result.total || 0),
    good: Number(result.good || 0),
    withImage: Number(result.withImage || 0),
    rating: Number(result.rating || 0),
    starCounts: result.starCounts || {}
  }))
}

export function toggleRemoteReviewLike(reviewId: number) {
  return request<{ liked: boolean; likeCount: number }, { reviewId: number }>({
    url: '/app/sport/review/like',
    method: 'POST',
    data: { reviewId }
  })
}
