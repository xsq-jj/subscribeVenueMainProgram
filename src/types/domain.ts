export type SportCategory = {
  id: number
  name: string
  icon: string
  color: string
}

export type Venue = {
  id: number
  name: string
  cover: string
  score: number
  district: string
  address: string
  distance: string
  tags: string[]
  tagTypes: string[]
  todayAvailableText: string
  minPrice: number
  monthlySales: string
}

export type VenueDate = {
  label: string
  week: string
  day: string
  value: string
}

export type VenueSlot = {
  id: number
  start: string
  end: string
  price: number
  status: 'available' | 'soldOut' | 'selected'
}

export type OrderStatus = 'WAIT_PAY' | 'WAIT_USE' | 'COMPLETED' | 'CANCELLED'

export type SportOrder = {
  id: number
  orderNo: string
  status: OrderStatus
  venueId?: number
  date?: string
  slotId?: number
  venueName: string
  venueCover: string
  dateText: string
  timeText: string
  courtName: string
  amount: number
}

export type CouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED'

export type UserCoupon = {
  id: number
  title: string
  description: string
  valueText: string
  thresholdText: string
  expireText: string
  status: CouponStatus
  theme: 'green' | 'purple' | 'orange'
}

export type SportRecord = {
  id: number
  venueId: number
  venueName: string
  sportType: string
  dateText: string
  timeText: string
  durationHour: number
  amount: number
  status: OrderStatus
}

export type FavoriteVenue = Venue & {
  categoryId: number
  reviewCount: number
}

export type CityRegion = {
  id: number
  city: string
  name: string
  count: number
}

export type VenueReview = {
  id: number
  userName: string
  avatar: string
  rating: number
  timeText: string
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  merchantReply?: string
}
