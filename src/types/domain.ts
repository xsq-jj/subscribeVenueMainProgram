export type SportCategory = {
  id: number
  name: string
  icon: string
  color: string
}

export type Venue = {
  id: number
  categoryId?: number
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
  city?: string
  reviewCount?: number
  businessHours?: string
  availableText?: string
  specs?: Record<string, string | number>
  images?: Array<{ id: number; url: string }>
  courts?: Array<{ id: number; name: string; basePrice?: number }>
}

export type VenueDate = {
  label: string
  week: string
  day: string
  value: string
}

export type VenueSlot = {
  id: number
  inventoryId?: number
  venueId?: number
  courtId?: number
  courtName?: string
  date?: string
  start: string
  end: string
  price: number
  availableStock?: number
  status: 'available' | 'soldOut' | 'selected' | 'locked'
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
  venueAddress?: string
  dateText: string
  timeText: string
  courtName: string
  amount: number
  totalAmount?: number
  discountAmount?: number
  payAmount?: number
  contactName?: string
  contactPhone?: string
  items?: Array<{
    id: number
    inventoryId: number
    venueId?: number
    courtId: number
    courtName?: string
    slotDate: string
    startTime: string
    endTime: string
    price: number
    amount?: number
  }>
}

export type CouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED'

export type UserCoupon = {
  id: number
  couponId?: number
  title: string
  description: string
  valueText: string
  thresholdText: string
  expireText: string
  status: CouponStatus
  theme: 'green' | 'purple' | 'orange'
  amount?: number
  discountRate?: number
}

export type SportRecord = {
  id: number
  venueId: number
  venueName: string
  sportType: string
  slotDate?: string
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
  venueId?: number
  userName: string
  avatar: string
  rating: number
  timeText: string
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  merchantReply?: string
  liked?: boolean
}
