import { defineStore } from 'pinia'
import { getHomeData } from '@/services/home'
import {
  categories as seedCategories,
  cityRegions as seedCityRegions,
  coupons as seedCoupons,
  favoriteVenues as seedVenues,
  findVenue,
  hotSearchWords as seedHotSearchWords,
  orders as seedOrders,
  reviews as seedReviews,
  slots as seedSlots,
  sportRecords as seedSportRecords
} from '@/services/mock'
import { getMyCoupons } from '@/services/coupon'
import { getFavoriteIds, getFavoriteList, toggleRemoteFavorite } from '@/services/favorite'
import { getCityRegions, getHotSearchWords } from '@/services/meta'
import {
  cancelOrder as cancelRemoteOrder,
  completeOrder as completeRemoteOrder,
  createOrder as createRemoteOrder,
  getOrderInfo as getRemoteOrderInfo,
  getOrderPage as getRemoteOrderPage,
  previewOrder as previewRemoteOrder,
  type OrderPreviewResult
} from '@/services/order'
import { getSportRecordPage, getSportRecordStats } from '@/services/record'
import { getReviewPage, getReviewSummary, toggleRemoteReviewLike, type ReviewSummary } from '@/services/review'
import { getVenueInfo, getVenuePage, getVenueSlots } from '@/services/venue'
import type {
  CityRegion,
  CouponStatus,
  OrderStatus,
  SportCategory,
  SportOrder,
  SportRecord,
  UserCoupon,
  Venue,
  VenueDate,
  VenueReview,
  VenueSlot
} from '@/types/domain'

type OrderFilter = 'ALL' | OrderStatus
type CouponFilter = 'AVAILABLE' | 'USED' | 'EXPIRED'
type ReviewFilter = 'ALL' | 'GOOD' | 'IMAGE' | 'LATEST'
type VenueSort = 'recommend' | 'distance' | 'price'
type HomeBanner = {
  id: number
  title: string
  subTitle: string
  image?: string
  type: string
  targetUrl?: string
}

type BookingState = {
  categoryId: number
  keyword: string
  sort: VenueSort
  venueId: number
  date: string
  slotId: number
  orderId: number
  orderFilter: OrderFilter
  contactName: string
  contactPhone: string
  orders: SportOrder[]
  categories: SportCategory[]
  venues: Venue[]
  venueDetail: Venue | null
  venueSlots: VenueSlot[]
  venueDates: VenueDate[]
  orderPreview: OrderPreviewResult | null
  homeBanners: HomeBanner[]
  loadingHome: boolean
  loadingVenues: boolean
  loadingVenueDetail: boolean
  loadingSlots: boolean
  venueDetailError: string
  slotError: string
  loadingOrders: boolean
  orderError: string
  coupons: UserCoupon[]
  loadingCoupons: boolean
  couponError: string
  couponFilter: CouponFilter
  selectedCouponId: number
  records: SportRecord[]
  recordStatsData: {
    count: number
    hours: number
    amount: number
  }
  recordTypeStatsData: Array<{ type: string; count: number }>
  loadingRecords: boolean
  recordError: string
  recordFilter: string
  recordExpanded: boolean
  favoriteCategoryId: number
  favoriteEditMode: boolean
  favoriteVenueIds: number[]
  favoriteVisibleCount: number
  loadingFavorites: boolean
  favoriteError: string
  regions: CityRegion[]
  currentCity: string
  currentRegion: string
  locationKeyword: string
  hotWords: string[]
  hotWordHeats: Record<string, number>
  searchKeyword: string
  searchHistory: string[]
  reviews: VenueReview[]
  reviewSummaryData: ReviewSummary
  loadingReviews: boolean
  reviewError: string
  reviewFilter: ReviewFilter
  reviewPage: number
  reviewPageSize: number
  reviewTotal: number
  reviewHasMore: boolean
  reviewVisibleCount: number
  likedReviewIds: number[]
}

const DEFAULT_CONTACT = {
  name: '张三',
  phone: '13888888888'
}

function cloneOrders() {
  return seedOrders.map(item => ({ ...item }))
}

function formatDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createNextVenueDates(count = 7): VenueDate[] {
  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    return {
      label: index === 0 ? '今天' : index === 1 ? '明天' : '',
      week: weekNames[date.getDay()],
      day: String(date.getDate()),
      value: formatDateValue(date)
    }
  })
}

const initialVenueDates = createNextVenueDates()

function formatDateText(value: string, dates: VenueDate[] = initialVenueDates) {
  const item = dates.find(date => date.value === value)
  if (item) {
    const [year, month] = item.value.split('-').map(Number)
    return `${year}年${month}月${item.day}日 ${item.week}`
  }

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}年${month}月${day}日 ${weekNames[new Date(year, month - 1, day).getDay()]}`
}

function buildOrderNo(id: number) {
  return `YD${formatDateValue(new Date()).replace(/-/g, '')}${String(id).padStart(3, '0')}`
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

function mergeVenues(base: Venue[], incoming: Venue[]) {
  const map = new Map<number, Venue>()
  base.forEach(item => map.set(item.id, item))
  incoming.forEach(item => map.set(item.id, item))
  return Array.from(map.values())
}

function withAllCategory(list: SportCategory[]) {
  const allCategory = seedCategories[0]
  return [allCategory, ...list.filter(item => item.id !== allCategory.id)]
}

function buildRecordStats(list: SportRecord[]) {
  const completed = list.filter(item => item.status === 'COMPLETED')
  const typeStats = completed.reduce<Array<{ type: string; count: number }>>((acc, item) => {
    const matched = acc.find(stat => stat.type === item.sportType)
    if (matched) {
      matched.count += 1
    } else {
      acc.push({ type: item.sportType, count: 1 })
    }
    return acc
  }, [])

  return {
    stats: {
      count: completed.length,
      hours: completed.reduce((sum, item) => sum + Number(item.durationHour || 0), 0),
      amount: completed.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    },
    typeStats
  }
}

function firstAvailableSlot(list: VenueSlot[]) {
  return list.find(item => item.status === 'available' || item.status === 'selected') || list[0]
}

function isUnavailableSlot(slot?: VenueSlot) {
  return !slot || slot.status === 'soldOut' || slot.status === 'locked'
}

const initialRecordStats = buildRecordStats(seedSportRecords)

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    categoryId: 0,
    keyword: '',
    sort: 'recommend',
    venueId: 1,
    date: initialVenueDates[0]?.value || formatDateValue(new Date()),
    slotId: seedSlots[0]?.id || 1,
    orderId: 1,
    orderFilter: 'ALL',
    contactName: DEFAULT_CONTACT.name,
    contactPhone: DEFAULT_CONTACT.phone,
    orders: cloneOrders(),
    categories: seedCategories,
    venues: seedVenues,
    venueDetail: null,
    venueSlots: seedSlots,
    venueDates: initialVenueDates,
    orderPreview: null,
    homeBanners: [
      {
        id: 1,
        title: '新用户专享',
        subTitle: '首单立减20元，快来预约吧！',
        type: 'coupon'
      }
    ],
    loadingHome: false,
    loadingVenues: false,
    loadingVenueDetail: false,
    loadingSlots: false,
    venueDetailError: '',
    slotError: '',
    loadingOrders: false,
    orderError: '',

    coupons: seedCoupons,
    loadingCoupons: false,
    couponError: '',
    couponFilter: 'AVAILABLE',
    selectedCouponId: 1,

    records: seedSportRecords,
    recordStatsData: initialRecordStats.stats,
    recordTypeStatsData: initialRecordStats.typeStats,
    loadingRecords: false,
    recordError: '',
    recordFilter: 'ALL',
    recordExpanded: false,

    favoriteCategoryId: 0,
    favoriteEditMode: false,
    favoriteVenueIds: seedVenues.map(item => item.id),
    favoriteVisibleCount: 4,
    loadingFavorites: false,
    favoriteError: '',

    regions: seedCityRegions,
    currentCity: '北京',
    currentRegion: '朝阳区',
    locationKeyword: '',

    hotWords: seedHotSearchWords,
    hotWordHeats: seedHotSearchWords.reduce<Record<string, number>>((map, word, index) => {
      map[word] = Math.max(0, 2300 - index * 250)
      return map
    }, {}),
    searchKeyword: '',
    searchHistory: ['篮球场', '朝阳区', '羽毛球', '周末', '室内', '网球', '海淀', '免费停车'],

    reviews: seedReviews,
    reviewSummaryData: {
      total: seedReviews.length,
      good: seedReviews.filter(item => item.rating >= 4).length,
      withImage: seedReviews.filter(item => item.images.length > 0).length,
      starCounts: seedReviews.reduce<Record<number, number>>((map, item) => {
        map[item.rating] = (map[item.rating] || 0) + 1
        return map
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    },
    loadingReviews: false,
    reviewError: '',
    reviewFilter: 'ALL',
    reviewPage: 1,
    reviewPageSize: 10,
    reviewTotal: seedReviews.length,
    reviewHasMore: false,
    reviewVisibleCount: 4,
    likedReviewIds: []
  }),
  getters: {
    recommendVenues(state) {
      return state.venues.slice(0, 2)
    },
    filteredVenueList(state) {
      const keyword = state.keyword.trim()
      let list = state.venues
        .filter(item => state.categoryId === 0 || item.categoryId === state.categoryId)
        .filter(item => !keyword || venueMatchesKeyword(item, keyword))

      if (state.sort === 'price') {
        list = [...list].sort((a, b) => a.minPrice - b.minPrice)
      } else if (state.sort === 'distance') {
        list = [...list].sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
      }

      return list
    },
    currentVenue(state) {
      if (state.venueDetail?.id === state.venueId) {
        return state.venueDetail
      }

      return state.venues.find(item => item.id === state.venueId) || findVenue(state.venueId)
    },
    currentSlot(state) {
      return state.venueSlots.find(item => item.id === state.slotId) || firstAvailableSlot(state.venueSlots) || seedSlots[0]
    },
    currentOrder(state) {
      return state.orders.find(item => item.id === state.orderId) || state.orders[0]
    },
    filteredOrders(state) {
      if (state.orderFilter === 'ALL') return state.orders

      return state.orders.filter(item => item.status === state.orderFilter)
    },
    selectedCoupon(state) {
      return state.coupons.find(item => item.id === state.selectedCouponId && item.status === 'AVAILABLE')
    },
    couponStats(state) {
      return {
        available: state.coupons.filter(item => item.status === 'AVAILABLE').length,
        used: state.coupons.filter(item => item.status === 'USED').length,
        expired: state.coupons.filter(item => item.status === 'EXPIRED').length
      }
    },
    filteredCoupons(state) {
      return state.coupons.filter(item => item.status === state.couponFilter)
    },
    filteredRecords(state) {
      let list = state.records
      if (state.recordFilter === '其他') {
        list = state.records.filter(item => !['篮球', '羽毛球', '网球'].includes(item.sportType))
      } else if (state.recordFilter !== 'ALL') {
        list = state.records.filter(item => item.sportType === state.recordFilter)
      }

      return state.recordExpanded ? list : list.slice(0, 5)
    },
    recordStats(state) {
      return state.recordStatsData
    },
    recordTypeStats(state) {
      return state.recordTypeStatsData
    },
    favoriteList(state) {
      return state.venues
        .filter(item => state.favoriteVenueIds.includes(item.id))
        .filter(item => state.favoriteCategoryId === 0 || item.categoryId === state.favoriteCategoryId)
        .slice(0, state.favoriteVisibleCount)
    },
    favoriteTotal(state) {
      return state.venues.filter(item => state.favoriteVenueIds.includes(item.id)).length
    },
    favoriteCategoryTotal(state) {
      return state.venues
        .filter(item => state.favoriteVenueIds.includes(item.id))
        .filter(item => state.favoriteCategoryId === 0 || item.categoryId === state.favoriteCategoryId).length
    },
    searchSuggestions(state) {
      const keyword = state.searchKeyword.trim()
      if (!keyword) return []

      return state.venues
        .filter(item => venueMatchesKeyword(item, keyword))
        .slice(0, 6)
    },
    hotSearchWords(state) {
      return state.hotWords
    },
    searchResultVenues(state) {
      const keyword = state.searchKeyword.trim()
      if (!keyword) return []

      return state.venues.filter(item => venueMatchesKeyword(item, keyword))
    },
    filteredRegions(state) {
      return state.regions.filter(item => {
        const matchCity = item.city === state.currentCity
        const keyword = state.locationKeyword.trim()
        if (!keyword) return matchCity

        return matchCity && includesKeyword(item.name, keyword)
      })
    },
    filteredReviews(state) {
      let list = [...state.reviews]
      if (state.reviewFilter === 'GOOD') {
        list = list.filter(item => item.rating >= 4)
      }
      if (state.reviewFilter === 'IMAGE') {
        list = list.filter(item => item.images.length > 0)
      }
      if (state.reviewFilter === 'LATEST') {
        list = [...list].sort((a, b) => b.id - a.id)
      }

      return list.slice(0, state.reviewVisibleCount)
    },
    reviewFilteredTotal(state) {
      if (state.reviewFilter === 'GOOD') {
        return state.reviews.filter(item => item.rating >= 4).length
      }
      if (state.reviewFilter === 'IMAGE') {
        return state.reviews.filter(item => item.images.length > 0).length
      }

      return Math.max(state.reviewTotal, state.reviews.length)
    },
    reviewSummary(state) {
      return state.reviewSummaryData
    }
  },
  actions: {
    async loadHomeData() {
      if (this.loadingHome) return

      this.loadingHome = true
      try {
        const data = await getHomeData()
        this.currentCity = data.city?.replace('市朝阳区', '') || this.currentCity
        if (data.categories.length) {
          this.categories = withAllCategory(data.categories)
        }
        if (data.recommendVenues.length) {
          this.venues = mergeVenues(this.venues, data.recommendVenues)
        }
        if (data.banners.length) {
          this.homeBanners = data.banners
        }
      } catch {
        // 后端未启动时继续使用本地 mock，保证 UI 可预览。
      } finally {
        this.loadingHome = false
      }
    },
    async loadVenuePage() {
      if (this.loadingVenues) return

      this.loadingVenues = true
      try {
        const result = await getVenuePage({
          page: 1,
          size: 20,
          categoryId: this.categoryId || undefined,
          keyword: this.keyword || undefined,
          sort: this.sort
        })

        if (result.list.length) {
          this.venues = result.list
        }
      } catch {
        // 保留现有列表作为兜底。
      } finally {
        this.loadingVenues = false
      }
    },
    async loadVenueDetail(venueId = this.venueId) {
      this.selectVenue(venueId)
      if (this.loadingVenueDetail) return

      this.loadingVenueDetail = true
      this.venueDetailError = ''
      try {
        const venue = await getVenueInfo(venueId)
        if (venue?.id) {
          this.venueDetail = venue
          this.venues = mergeVenues(this.venues, [venue])
        }
      } catch {
        this.venueDetail = this.venues.find(item => item.id === venueId) || findVenue(venueId)
        this.venueDetailError = '场馆详情加载失败，已显示本地兜底数据'
      } finally {
        this.loadingVenueDetail = false
      }
    },
    async loadVenueSlots(venueId = this.venueId, date = this.date) {
      this.loadingSlots = true
      this.slotError = ''
      try {
        const list = await getVenueSlots(venueId, date)
        this.venueSlots = list.length ? list : []
        const activeSlot = this.venueSlots.find(item => item.id === this.slotId)
        if (isUnavailableSlot(activeSlot)) {
          const nextSlot = firstAvailableSlot(this.venueSlots)
          if (nextSlot) this.slotId = nextSlot.id
        }
      } catch {
        this.venueSlots = seedSlots
        this.slotError = '时段加载失败，已显示本地兜底数据'
      } finally {
        this.loadingSlots = false
      }
    },
    async previewOrder() {
      const slot = this.currentSlot
      if (isUnavailableSlot(slot)) {
        this.orderPreview = null
        return null
      }

      try {
        this.orderPreview = await previewRemoteOrder({
          inventoryIds: [slot.inventoryId || slot.id],
          couponId: this.selectedCoupon?.couponId || this.selectedCoupon?.id
        })
        return this.orderPreview
      } catch {
        this.orderPreview = null
        return null
      }
    },
    async loadOrders() {
      this.loadingOrders = true
      this.orderError = ''
      try {
        const result = await getRemoteOrderPage(this.orderFilter === 'ALL' ? undefined : this.orderFilter)
        this.orders = result.list
        if (this.orders.length && !this.orders.some(item => item.id === this.orderId)) {
          this.orderId = this.orders[0].id
        }
      } catch {
        // 未登录或后端不可用时由 request 层提示，页面保留本地订单兜底。
        this.orderError = '订单加载失败，请稍后重试'
      } finally {
        this.loadingOrders = false
      }
    },
    async loadOrderDetail(orderId = this.orderId) {
      try {
        const order = await getRemoteOrderInfo(orderId)
        if (order) {
          this.upsertOrder(order)
          this.orderId = order.id
          return order
        }
        return this.getOrderById(orderId)
      } catch {
        return this.getOrderById(orderId)
      }
    },
    async loadCoupons() {
      if (this.loadingCoupons) return

      this.loadingCoupons = true
      this.couponError = ''
      try {
        const list = await getMyCoupons()
        this.coupons = list
        const selected = this.coupons.find(item => item.id === this.selectedCouponId && item.status === 'AVAILABLE')
        if (!selected) {
          this.selectedCouponId = this.coupons.find(item => item.status === 'AVAILABLE')?.id || 0
        }
      } catch {
        // 保留本地优惠券作为兜底。
        this.couponError = '优惠券加载失败，已显示本地兜底数据'
      } finally {
        this.loadingCoupons = false
      }
    },
    async loadFavorites() {
      if (this.loadingFavorites) return

      this.loadingFavorites = true
      this.favoriteError = ''
      try {
        const [venues, ids] = await Promise.all([getFavoriteList(), getFavoriteIds()])
        this.favoriteVenueIds = ids
        this.venues = mergeVenues(this.venues, venues)
      } catch {
        // 保留本地收藏作为兜底。
        this.favoriteError = '收藏加载失败，已显示本地兜底数据'
      } finally {
        this.loadingFavorites = false
      }
    },
    async loadRecordData() {
      if (this.loadingRecords) return

      this.loadingRecords = true
      this.recordError = ''
      try {
        const [recordsResult, statsResult] = await Promise.all([
          getSportRecordPage({ page: 1, size: 50 }),
          getSportRecordStats()
        ])
        this.records = recordsResult.list
        this.recordStatsData = {
          count: statsResult.count,
          hours: statsResult.hours,
          amount: statsResult.amount
        }
        this.recordTypeStatsData = statsResult.typeStats
      } catch {
        // 保留本地运动记录作为兜底。
        this.recordError = '运动记录加载失败，请稍后重试'
      } finally {
        this.loadingRecords = false
      }
    },
    async loadRegions(city = this.currentCity) {
      try {
        const list = await getCityRegions(city)
        if (list.length) {
          this.regions = list
        }
      } catch {
        // 保留本地区域作为兜底。
      }
    },
    async loadHotSearchWords() {
      try {
        const list = await getHotSearchWords()
        if (list.length) {
          this.hotWords = list.map(item => item.keyword)
          this.hotWordHeats = list.reduce<Record<string, number>>((map, item) => {
            map[item.keyword] = item.heat
            return map
          }, {})
        }
      } catch {
        // 保留本地热搜作为兜底。
      }
    },
    async loadReviews(venueId = this.venueId, reset = true) {
      if (this.loadingReviews) return

      this.loadingReviews = true
      this.reviewError = ''
      try {
        const page = reset ? 1 : this.reviewPage + 1
        const result = await getReviewPage({
          venueId,
          filter: this.reviewFilter,
          page,
          size: this.reviewPageSize
        })
        this.reviews = reset
          ? result.list
          : [
              ...this.reviews,
              ...result.list.filter(item => !this.reviews.some(review => review.id === item.id))
            ]
        this.reviewPage = result.pagination.page
        this.reviewTotal = result.pagination.total
        this.reviewHasMore = this.reviews.length < result.pagination.total
        this.reviewVisibleCount = Math.max(this.reviews.length, 4)
      } catch {
        // 保留本地评价作为兜底。
        this.reviewError = '评论加载失败，请稍后重试'
        this.reviewTotal = this.reviews.length
        this.reviewHasMore = false
      } finally {
        this.loadingReviews = false
      }
    },
    async loadReviewSummary(venueId = this.venueId) {
      try {
        this.reviewSummaryData = await getReviewSummary(venueId)
      } catch {
        // 保留本地评价统计作为兜底。
      }
    },
    setCategory(categoryId: number) {
      this.categoryId = categoryId
      this.keyword = ''
      void this.loadVenuePage()
    },
    setKeyword(keyword: string) {
      this.keyword = keyword
      void this.loadVenuePage()
    },
    setSort(sort: VenueSort) {
      this.sort = sort
      void this.loadVenuePage()
    },
    setOrderFilter(status: OrderFilter) {
      this.orderFilter = status
      void this.loadOrders()
    },
    selectVenue(venueId: number) {
      this.venueId = venueId
    },
    selectDate(date: string) {
      this.date = date
      void this.loadVenueSlots(this.venueId, date)
    },
    selectSlot(slotId: number) {
      const slot = this.venueSlots.find(item => item.id === slotId)
      if (isUnavailableSlot(slot)) {
        uni.showToast({ title: '该时段已约满', icon: 'none' })
        return false
      }

      this.slotId = slotId
      uni.showToast({ title: `已选择 ${slot.start}-${slot.end}`, icon: 'none' })
      void this.previewOrder()
      return true
    },
    selectBooking(venueId: number, date = this.date, slotId = this.slotId) {
      this.venueId = venueId
      this.date = date
      this.slotId = slotId
    },
    createOrder() {
      const venue = this.currentVenue
      const slot = this.currentSlot

      if (isUnavailableSlot(slot)) {
        uni.showToast({ title: '请选择可预约时段', icon: 'none' })
        return null
      }

      const id = Math.max(0, ...this.orders.map(item => item.id)) + 1
      const duration = 2
      const totalAmount = slot.price * duration
      const coupon = this.selectedCoupon
      const couponAmount = coupon
        ? Math.min(
            totalAmount,
            coupon.amount || Math.max(0, totalAmount - totalAmount * (coupon.discountRate || 1))
          )
        : 0
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
        dateText: formatDateText(this.date, this.venueDates),
        timeText: `${slot.start}-${slot.end}`,
        courtName: slot.courtName || (slot.id === 4 ? '3号场地' : `${Math.min(slot.id, 3)}号场地`),
        amount
      }

      this.upsertOrder(order)
      this.orderId = id
      return order
    },
    async submitOrder() {
      const slot = this.currentSlot
      if (isUnavailableSlot(slot)) {
        uni.showToast({ title: '请选择可预约时段', icon: 'none' })
        return null
      }

      try {
        const order = await createRemoteOrder({
          inventoryIds: [slot.inventoryId || slot.id],
          couponId: this.selectedCoupon?.couponId || this.selectedCoupon?.id,
          contactName: this.contactName,
          contactPhone: this.contactPhone,
          mockPaid: true
        })
        this.upsertOrder(order)
        this.orderId = order.id
        return order
      } catch {
        uni.showToast({ title: '订单创建失败，请检查后端服务和登录状态', icon: 'none' })
        return null
      }
    },
    upsertOrder(order: SportOrder) {
      const index = this.orders.findIndex(item => item.id === order.id)
      if (index >= 0) {
        this.orders.splice(index, 1, order)
      } else {
        this.orders.unshift(order)
      }
    },
    selectOrder(orderId: number) {
      if (this.orders.some(item => item.id === orderId)) {
        this.orderId = orderId
      }
    },
    getOrderById(orderId?: number) {
      return this.orders.find(item => item.id === orderId) || null
    },
    async cancelOrder(orderId: number) {
      const order = this.orders.find(item => item.id === orderId)
      if (!order) return false
      if (order.status !== 'WAIT_USE' && order.status !== 'WAIT_PAY') {
        uni.showToast({ title: '当前订单不可取消', icon: 'none' })
        return false
      }

      try {
        const nextOrder = await cancelRemoteOrder(orderId)
        this.upsertOrder(nextOrder)
        uni.showToast({ title: '预约已取消', icon: 'success' })
        return true
      } catch {
        order.status = 'CANCELLED'
        uni.showToast({ title: '预约已取消', icon: 'success' })
        return true
      }
    },
    async completeOrder(orderId: number) {
      const order = this.orders.find(item => item.id === orderId)
      if (!order) return false
      if (order.status !== 'WAIT_USE') {
        uni.showToast({ title: '当前订单不可完成', icon: 'none' })
        return false
      }

      try {
        const nextOrder = await completeRemoteOrder(orderId)
        this.upsertOrder(nextOrder)
        await this.loadRecordData()
        uni.showToast({ title: '订单已完成', icon: 'success' })
        return true
      } catch {
        uni.showToast({ title: '完成订单失败，请稍后重试', icon: 'none' })
        return false
      }
    },
    repeatOrder(orderId: number) {
      const order = this.orders.find(item => item.id === orderId)
      if (!order) return

      this.venueId = order.venueId || 1
      this.date = order.date || this.venueDates[0]?.value || formatDateValue(new Date())
      this.slotId = order.slotId || this.venueSlots[0]?.id || 1
    },
    setCouponFilter(status: CouponFilter) {
      this.couponFilter = status
    },
    selectCoupon(couponId: number) {
      const coupon = this.coupons.find(item => item.id === couponId)
      if (!coupon || coupon.status !== 'AVAILABLE') return false

      this.selectedCouponId = couponId
      void this.previewOrder()
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
    async toggleFavorite(venueId: number) {
      const localToggle = () => {
        if (this.favoriteVenueIds.includes(venueId)) {
          this.favoriteVenueIds = this.favoriteVenueIds.filter(id => id !== venueId)
        } else {
          this.favoriteVenueIds.push(venueId)
        }
      }

      try {
        const result = await toggleRemoteFavorite(venueId)
        if (result.favorited) {
          if (!this.favoriteVenueIds.includes(venueId)) {
            this.favoriteVenueIds.push(venueId)
          }
        } else {
          this.favoriteVenueIds = this.favoriteVenueIds.filter(id => id !== venueId)
        }
      } catch {
        localToggle()
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
      this.keyword = value
      void this.loadVenuePage()
    },
    clearSearchHistory() {
      this.searchHistory = []
    },
    selectLocation(city: string, region: string) {
      this.currentCity = city
      this.currentRegion = region
      this.locationKeyword = ''
      void this.loadRegions(city)
    },
    setLocationKeyword(keyword: string) {
      this.locationKeyword = keyword
    },
    setReviewFilter(filter: ReviewFilter) {
      this.reviewFilter = filter
      this.reviewVisibleCount = 4
      void this.loadReviews(this.venueId, true)
    },
    async loadMoreReviews() {
      if (this.reviewHasMore) {
        await this.loadReviews(this.venueId, false)
        return
      }

      this.reviewVisibleCount += 4
    },
    async toggleReviewLike(reviewId: number) {
      if (this.likedReviewIds.includes(reviewId)) {
        this.likedReviewIds = this.likedReviewIds.filter(id => id !== reviewId)
      } else {
        this.likedReviewIds.push(reviewId)
      }

      try {
        const result = await toggleRemoteReviewLike(reviewId)
        const review = this.reviews.find(item => item.id === reviewId)
        if (review) {
          review.likeCount = result.likeCount
          review.liked = result.liked
        }
        if (result.liked && !this.likedReviewIds.includes(reviewId)) {
          this.likedReviewIds.push(reviewId)
        }
        if (!result.liked) {
          this.likedReviewIds = this.likedReviewIds.filter(id => id !== reviewId)
        }
      } catch {
        // 未登录或接口失败时保留本地点赞视觉反馈。
      }
    }
  }
})
