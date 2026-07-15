import { defineStore } from 'pinia'
import {
  cityRegions,
  coupons,
  favoriteVenues,
  findVenue,
  hotSearchWords,
  orders as seedOrders,
  reviews,
  slots,
  sportRecords,
  venues,
  venueDates
} from '@/services/mock'
import type { CouponStatus, OrderStatus, SportOrder } from '@/types/domain'

type OrderFilter = 'ALL' | OrderStatus
type CouponFilter = 'AVAILABLE' | 'USED' | 'EXPIRED'
type ReviewFilter = 'ALL' | 'GOOD' | 'IMAGE' | 'LATEST'
type VenueSort = 'recommend' | 'distance' | 'price'

const DISCOUNT_AMOUNT = 20
const DEFAULT_CONTACT = {
  name: '张三',
  phone: '138****8888'
}

function cloneOrders() {
  return seedOrders.map(item => ({ ...item }))
}

function formatDateText(value: string) {
  const item = venueDates.find(date => date.value === value)
  if (!item) return value

  return `2025年1月${item.day}日 ${item.week}`
}

function buildOrderNo(id: number) {
  return `YD20250116${String(id).padStart(3, '0')}`
}

function includesKeyword(text: string, keyword: string) {
  return text.toLowerCase().includes(keyword.trim().toLowerCase())
}

function venueMatchesKeyword(
  item: { name: string; district: string; address: string; tags: string[] },
  keyword: string
) {
  const value = keyword.trim().toLowerCase()
  if (!value) return false

  const haystack = [item.name, item.district, item.address, ...item.tags].join(' ').toLowerCase()
  const semanticTerms = ['篮球', '羽毛球', '网球', '足球', '游泳', '室内', '室外', '停车', '朝阳', '海淀', '奥体', '周末']
    .filter(term => value.includes(term))
    .map(term => term.toLowerCase())

  return haystack.includes(value) || semanticTerms.some(term => haystack.includes(term))
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    categoryId: 0,
    keyword: '',
    sort: 'recommend' as VenueSort,
    venueId: 1,
    date: '2025-01-16',
    slotId: 4,
    orderId: 1,
    orderFilter: 'ALL' as OrderFilter,
    contactName: DEFAULT_CONTACT.name,
    contactPhone: DEFAULT_CONTACT.phone,
    orders: cloneOrders(),

    couponFilter: 'AVAILABLE' as CouponFilter,
    selectedCouponId: 1,

    recordFilter: 'ALL',
    recordExpanded: false,

    favoriteCategoryId: 0,
    favoriteEditMode: false,
    favoriteVenueIds: favoriteVenues.map(item => item.id),
    favoriteVisibleCount: 4,

    currentCity: '北京',
    currentRegion: '朝阳区',
    locationKeyword: '',

    searchKeyword: '',
    searchHistory: ['篮球场', '朝阳区', '羽毛球', '周末', '室内', '网球', '海淀', '免费停车'],

    reviewFilter: 'ALL' as ReviewFilter,
    reviewVisibleCount: 4,
    likedReviewIds: [] as number[]
  }),
  getters: {
    currentVenue(state) {
      return findVenue(state.venueId)
    },
    currentSlot(state) {
      return slots.find(item => item.id === state.slotId) || slots[0]
    },
    currentOrder(state) {
      return state.orders.find(item => item.id === state.orderId) || state.orders[0]
    },
    filteredOrders(state) {
      if (state.orderFilter === 'ALL') return state.orders

      return state.orders.filter(item => item.status === state.orderFilter)
    },
    selectedCoupon(state) {
      return coupons.find(item => item.id === state.selectedCouponId && item.status === 'AVAILABLE')
    },
    couponStats() {
      return {
        available: coupons.filter(item => item.status === 'AVAILABLE').length,
        used: coupons.filter(item => item.status === 'USED').length,
        expired: coupons.filter(item => item.status === 'EXPIRED').length
      }
    },
    filteredCoupons(state) {
      return coupons.filter(item => item.status === state.couponFilter)
    },
    filteredRecords(state) {
      let list = sportRecords
      if (state.recordFilter === '其他') {
        list = sportRecords.filter(item => !['篮球', '羽毛球', '网球'].includes(item.sportType))
      } else if (state.recordFilter !== 'ALL') {
        list = sportRecords.filter(item => item.sportType === state.recordFilter)
      }

      return state.recordExpanded ? list : list.slice(0, 5)
    },
    recordStats() {
      return {
        count: 36,
        hours: 72,
        amount: 3200
      }
    },
    recordTypeStats() {
      return [
        { type: '篮球', count: 18 },
        { type: '羽毛球', count: 10 },
        { type: '网球', count: 5 },
        { type: '其他', count: 3 }
      ]
    },
    favoriteList(state) {
      return favoriteVenues
        .filter(item => state.favoriteVenueIds.includes(item.id))
        .filter(item => state.favoriteCategoryId === 0 || item.categoryId === state.favoriteCategoryId)
        .slice(0, state.favoriteVisibleCount)
    },
    favoriteTotal(state) {
      return favoriteVenues.filter(item => state.favoriteVenueIds.includes(item.id)).length
    },
    favoriteCategoryTotal(state) {
      return favoriteVenues
        .filter(item => state.favoriteVenueIds.includes(item.id))
        .filter(item => state.favoriteCategoryId === 0 || item.categoryId === state.favoriteCategoryId).length
    },
    searchSuggestions(state) {
      const keyword = state.searchKeyword.trim()
      if (!keyword) return []

      return favoriteVenues
        .filter(item => venueMatchesKeyword(item, keyword))
        .slice(0, 6)
    },
    hotSearchWords() {
      return hotSearchWords
    },
    searchResultVenues(state) {
      const keyword = state.searchKeyword.trim()
      if (!keyword) return []

      return favoriteVenues.filter(item => venueMatchesKeyword(item, keyword))
    },
    filteredRegions(state) {
      return cityRegions.filter(item => {
        const matchCity = item.city === state.currentCity
        const keyword = state.locationKeyword.trim()
        if (!keyword) return matchCity

        return matchCity && includesKeyword(item.name, keyword)
      })
    },
    filteredReviews(state) {
      let list = [...reviews]
      if (state.reviewFilter === 'GOOD') {
        list = list.filter(item => item.rating >= 4)
      }
      if (state.reviewFilter === 'IMAGE') {
        list = list.filter(item => item.images.length > 0)
      }
      if (state.reviewFilter === 'LATEST') {
        list = [...list].sort((a, b) => a.id - b.id)
      }

      return list.slice(0, state.reviewVisibleCount)
    },
    reviewFilteredTotal(state) {
      if (state.reviewFilter === 'GOOD') {
        return reviews.filter(item => item.rating >= 4).length
      }
      if (state.reviewFilter === 'IMAGE') {
        return reviews.filter(item => item.images.length > 0).length
      }

      return reviews.length
    },
    reviewSummary() {
      return {
        total: 286,
        good: 245,
        withImage: 89
      }
    }
  },
  actions: {
    setCategory(categoryId: number) {
      this.categoryId = categoryId
      this.keyword = ''
    },
    setKeyword(keyword: string) {
      this.keyword = keyword
    },
    setSort(sort: VenueSort) {
      this.sort = sort
    },
    setOrderFilter(status: OrderFilter) {
      this.orderFilter = status
    },
    selectVenue(venueId: number) {
      this.venueId = venueId
    },
    selectDate(date: string) {
      this.date = date
    },
    selectSlot(slotId: number) {
      const slot = slots.find(item => item.id === slotId)
      if (!slot || slot.status === 'soldOut') {
        uni.showToast({ title: '该时段已约满', icon: 'none' })
        return false
      }

      this.slotId = slotId
      uni.showToast({ title: `已选择 ${slot.start}-${slot.end}`, icon: 'none' })
      return true
    },
    selectBooking(venueId: number, date = this.date, slotId = this.slotId) {
      this.venueId = venueId
      this.date = date
      this.slotId = slotId
    },
    createOrder() {
      const venue = findVenue(this.venueId)
      const slot = slots.find(item => item.id === this.slotId)

      if (!slot || slot.status === 'soldOut') {
        uni.showToast({ title: '请选择可预约时段', icon: 'none' })
        return null
      }

      const id = Math.max(0, ...this.orders.map(item => item.id)) + 1
      const duration = 2
      const totalAmount = slot.price * duration
      const coupon = this.selectedCoupon
      const couponAmount = coupon ? DISCOUNT_AMOUNT : 0
      const amount = Math.max(0, totalAmount - couponAmount)
      const order: SportOrder = {
        id,
        orderNo: buildOrderNo(id),
        status: 'WAIT_USE',
        venueId: venue.id,
        date: this.date,
        slotId: slot.id,
        venueName: venue.name,
        venueCover: venue.cover,
        dateText: formatDateText(this.date),
        timeText: `${slot.start}-${slot.end}`,
        courtName: slot.id === 4 ? '3号场地' : `${Math.min(slot.id, 3)}号场地`,
        amount
      }

      this.orders.unshift(order)
      this.orderId = id
      return order
    },
    selectOrder(orderId: number) {
      if (this.orders.some(item => item.id === orderId)) {
        this.orderId = orderId
      }
    },
    getOrderById(orderId?: number) {
      return this.orders.find(item => item.id === orderId) || this.currentOrder
    },
    cancelOrder(orderId: number) {
      const order = this.orders.find(item => item.id === orderId)
      if (!order) return false
      if (order.status !== 'WAIT_USE' && order.status !== 'WAIT_PAY') {
        uni.showToast({ title: '当前订单不可取消', icon: 'none' })
        return false
      }

      order.status = 'CANCELLED'
      uni.showToast({ title: '预约已取消', icon: 'success' })
      return true
    },
    repeatOrder(orderId: number) {
      const order = this.orders.find(item => item.id === orderId)
      if (!order) return

      this.venueId = order.venueId || 1
      this.date = order.date || '2025-01-16'
      this.slotId = order.slotId || 4
    },
    setCouponFilter(status: CouponFilter) {
      this.couponFilter = status
    },
    selectCoupon(couponId: number) {
      const coupon = coupons.find(item => item.id === couponId)
      if (!coupon || coupon.status !== 'AVAILABLE') return false

      this.selectedCouponId = couponId
      return true
    },
    setRecordFilter(type: string) {
      this.recordFilter = type
      this.recordExpanded = false
    },
    toggleRecordExpanded() {
      this.recordExpanded = !this.recordExpanded
    },
    setFavoriteCategory(categoryId: number) {
      this.favoriteCategoryId = categoryId
      this.favoriteVisibleCount = 4
    },
    toggleFavoriteEditMode() {
      this.favoriteEditMode = !this.favoriteEditMode
    },
    toggleFavorite(venueId: number) {
      if (this.favoriteVenueIds.includes(venueId)) {
        this.favoriteVenueIds = this.favoriteVenueIds.filter(id => id !== venueId)
      } else {
        this.favoriteVenueIds.push(venueId)
      }
    },
    loadMoreFavorites() {
      this.favoriteVisibleCount += 4
    },
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
    },
    runSearch(keyword = this.searchKeyword) {
      const value = keyword.trim()
      if (!value) return

      this.searchKeyword = value
      this.searchHistory = [value, ...this.searchHistory.filter(item => item !== value)].slice(0, 10)
    },
    clearSearchHistory() {
      this.searchHistory = []
    },
    selectLocation(city: string, region: string) {
      this.currentCity = city
      this.currentRegion = region
      this.locationKeyword = ''
    },
    setLocationKeyword(keyword: string) {
      this.locationKeyword = keyword
    },
    setReviewFilter(filter: ReviewFilter) {
      this.reviewFilter = filter
      this.reviewVisibleCount = 4
    },
    loadMoreReviews() {
      this.reviewVisibleCount += 4
    },
    toggleReviewLike(reviewId: number) {
      if (this.likedReviewIds.includes(reviewId)) {
        this.likedReviewIds = this.likedReviewIds.filter(id => id !== reviewId)
      } else {
        this.likedReviewIds.push(reviewId)
      }
    }
  }
})
