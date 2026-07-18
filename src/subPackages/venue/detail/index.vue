<template>
  <view class="page-shell detail-page">
    <view class="hero">
      <image class="hero-img" :src="heroImage" mode="aspectFill" />
      <view class="hero-top">
        <view class="round-btn" @tap="back">
          <text class="ri ri-arrow-left-s-line"></text>
        </view>
        <view class="hero-actions">
          <view class="round-btn">
            <text class="ri ri-share-forward-line"></text>
          </view>
          <view class="round-btn" @tap="store.toggleFavorite(venue.id)">
            <text :class="['ri', isFavorite ? 'ri-heart-fill' : 'ri-heart-line']"></text>
          </view>
        </view>
      </view>
      <view class="hero-dots">
        <view class="dot active"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>

    <view v-if="store.loadingVenueDetail" class="state-strip">场馆详情加载中...</view>
    <view v-else-if="store.venueDetailError" class="state-strip warn">
      <text>{{ store.venueDetailError }}</text>
      <text class="retry-link" @tap="reloadVenue">重试</text>
    </view>

    <view class="venue-panel">
      <view class="title-row">
        <view>
          <text class="venue-name">{{ venue.name }}</text>
          <view class="score-row">
            <text class="star">★</text>
            <text>{{ venue.score }}</text>
            <text class="muted">（{{ venue.reviewCount || store.reviewSummary.total }}条评价）</text>
            <text class="muted">月售 {{ venue.monthlySales }}</text>
          </view>
        </view>
        <view class="detail-price">
          <text>¥{{ venue.minPrice }}</text>
          <text>/小时起</text>
        </view>
      </view>
      <view class="address" @tap="go(ROUTES.LOCATION)">
        <text class="ri ri-map-pin-line"></text>
        <text>{{ venueAddressText }}</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="tag-row">
        <text
          v-for="(tag, index) in venue.tags"
          :key="tag"
          class="tag"
          :class="`tag-${venue.tagTypes[index] || 'green'}`"
        >
          {{ tagLabel(tag) }}
        </text>
      </view>
    </view>

    <view class="section specs">
      <text class="section-title">场地规格</text>
      <view class="spec-grid">
        <view v-for="item in specs" :key="item.label" class="spec-item">
          <text>{{ item.value }}</text>
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-head">
        <text class="section-title">选择预约日期</text>
        <view class="month">
          <text class="ri ri-calendar-line"></text>
          <text>{{ monthText }}</text>
          <text class="ri ri-arrow-down-s-line"></text>
        </view>
      </view>
      <date-selector
        :items="venueDates"
        :model-value="store.date"
        @update:model-value="changeDate"
      />
    </view>

    <view class="section">
      <text class="section-title">选择时段</text>
      <view v-if="store.loadingSlots" class="slot-state">时段加载中...</view>
      <template v-else>
      <view v-if="store.slotError" class="slot-state warn">
        <text>{{ store.slotError }}</text>
        <text class="retry-link" @tap="reloadSlots">重试</text>
      </view>
      <time-slot-grid
        :items="venueSlots"
        :model-value="store.slotId"
        @update:model-value="store.selectSlot"
      />
      </template>
    </view>

    <view class="section reviews">
      <view class="section-head">
        <text class="section-title">用户评价（{{ store.reviewSummary.total }}）</text>
        <view class="more" @tap="go(reviewListUrl)">
          <text>全部</text>
          <text class="ri ri-arrow-right-s-line"></text>
        </view>
      </view>
      <view class="review-tabs">
        <text class="active">全部 {{ store.reviewSummary.total }}</text>
        <text>好评 {{ store.reviewSummary.good }}</text>
        <text>有图 {{ store.reviewSummary.withImage }}</text>
      </view>
      <view v-for="review in previewReviews" :key="review.id" class="review-item">
        <view class="review-header">
          <image class="avatar" :src="review.avatar" mode="aspectFill" />
          <view class="review-user">
            <text>{{ review.userName }}</text>
            <view class="review-meta">
              <text class="review-stars">{{ stars(review.rating) }}</text>
              <text class="muted">{{ review.timeText }}</text>
            </view>
          </view>
        </view>
        <text class="review-content">{{ review.content }}</text>
      </view>
    </view>

    <view class="submit-bar">
      <view>
        <text class="selected">已选：{{ selectedText }}</text>
        <view class="total-price">
          <text>¥{{ totalAmount }}</text>
          <text>/2小时</text>
        </view>
      </view>
      <view class="submit-btn" @tap="confirm">立即预约</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import DateSelector from '@/components/date-selector/date-selector.vue'
import TimeSlotGrid from '@/components/time-slot-grid/time-slot-grid.vue'
import { ROUTES, orderConfirmRoute, withQuery } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { goBack, navigateTo } from '@/utils/router'

const store = useBookingStore()

const venue = computed(() => store.currentVenue)
const slot = computed(() => store.currentSlot)
const heroImage = computed(() => venue.value.images?.[0]?.url || venue.value.cover || '/static/images/detail-hero.png')
const venueSlots = computed(() => store.venueSlots)
const venueDates = computed(() => store.venueDates)
const isFavorite = computed(() => store.favoriteVenueIds.includes(venue.value.id))
const totalAmount = computed(() => slot.value.price * 2)
const selectedText = computed(() => `${selectedDateText.value} ${slot.value.start}-${slot.value.end}`)
const selectedDateText = computed(() => {
  const date = store.venueDates.find(item => item.value === store.date)
  return date ? `${date.day}日` : store.date
})
const monthText = computed(() => {
  const [year, month] = store.date.split('-')
  return year && month ? `${year}年${Number(month)}月` : '选择日期'
})
const reviewListUrl = computed(() => withQuery(ROUTES.REVIEW_LIST, { venueId: venue.value.id }))
const previewReviews = computed(() => store.filteredReviews.slice(0, 2))
const venueAddressText = computed(() => {
  const item = venue.value
  const address = item.address || ''
  const parts: string[] = []
  const city = item.city || store.currentCity
  const cityText = city && city.endsWith('市') ? city : city ? `${city}市` : ''

  if (cityText && !address.includes(cityText)) {
    parts.push(cityText)
  }
  if (item.district && !address.includes(item.district)) {
    parts.push(item.district)
  }
  if (address) {
    parts.push(address)
  }

  return parts.join('') || '地址待完善'
})

const specs = computed(() => {
  const data = venue.value.specs
  if (!data) {
    return [
      { value: '6', label: '标准全场' },
      { value: 'A级', label: '枫木地板' },
      { value: '30', label: '人/场' },
      { value: '9m', label: '挑高' }
    ]
  }

  return [
    { value: data.courtCount || '6', label: '标准全场' },
    { value: data.floor || 'A级', label: '地板材质' },
    { value: data.capacity || '30人/场', label: '容量' },
    { value: data.height || '9m', label: '挑高' }
  ]
})

onLoad(query => {
  const id = Number(query.id || store.venueId || 1)
  const venueId = Number.isNaN(id) ? 1 : id
  store.selectVenue(venueId)
  void store.loadVenueDetail(venueId)
  void store.loadVenueSlots(venueId, store.date).then(() => store.previewOrder())
  void store.loadReviews(venueId)
  void store.loadReviewSummary(venueId)
})

function tagLabel(tag: string) {
  if (tag === '空调') return '中央空调'
  if (tag === '免费停车') return '免费停车'
  if (tag === '室内') return '室内场地'
  return tag
}

function stars(rating: number) {
  return '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating)
}

function go(url: string) {
  navigateTo(url)
}

function changeDate(date: string) {
  store.date = date
  void store.loadVenueSlots(venue.value.id, date).then(() => store.previewOrder())
}

function reloadVenue() {
  void store.loadVenueDetail(venue.value.id)
}

function reloadSlots() {
  void store.loadVenueSlots(venue.value.id, store.date).then(() => store.previewOrder())
}

function back() {
  goBack(ROUTES.TAB_VENUE)
}

function confirm() {
  store.selectBooking(venue.value.id, store.date, store.slotId)
  navigateTo(orderConfirmRoute(venue.value.id))
}
</script>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  padding-bottom: calc(134rpx + env(safe-area-inset-bottom));
  background: #f9fafb;
}

.hero {
  position: relative;
  height: 391rpx;
}

.hero-img {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-top {
  position: absolute;
  top: 84rpx;
  right: 35rpx;
  left: 35rpx;
  display: flex;
  justify-content: space-between;
}

.hero-actions {
  display: flex;
  gap: 14rpx;
}

.round-btn {
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: #ffffff;
  color: #111827;
  font-size: 31rpx;
  box-shadow: 0 3rpx 14rpx rgba(0, 0, 0, 0.12);
}

.round-btn .ri-heart-fill {
  color: #ff3b6b;
}

.hero-dots {
  position: absolute;
  right: 3rpx;
  bottom: 2rpx;
  display: flex;
  gap: 7rpx;
}

.dot {
  width: 12rpx;
  height: 10rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.65);
}

.dot.active {
  width: 37rpx;
  background: #ffffff;
}

.venue-panel {
  position: relative;
  z-index: 2;
  padding: 35rpx 35rpx 28rpx;
  border-radius: 42rpx 42rpx 0 0;
  background: #ffffff;
}

.state-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64rpx;
  padding: 0 35rpx;
  background: #ffffff;
  color: #9ca3af;
  font-size: 22rpx;
}

.state-strip.warn,
.slot-state.warn {
  justify-content: space-between;
  background: #fffbeb;
  color: #b45309;
}

.retry-link {
  margin-left: 20rpx;
  color: #059669;
  font-weight: 800;
}

.slot-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  margin: 0 35rpx 18rpx;
  padding: 0 22rpx;
  border-radius: 18rpx;
  background: #f8fafc;
  color: #9ca3af;
  font-size: 22rpx;
}

.title-row,
.score-row,
.address,
.tag-row,
.section-head,
.month,
.more,
.review-header,
.review-meta,
.submit-bar {
  display: flex;
  align-items: center;
}

.title-row,
.section-head,
.submit-bar {
  justify-content: space-between;
}

.venue-name {
  display: block;
  color: #1a1a2e;
  font-size: 35rpx;
  font-weight: 700;
}

.score-row {
  gap: 7rpx;
  margin-top: 10rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 600;
}

.star,
.review-stars {
  color: #f59e0b;
}

.muted {
  color: #9ca3af;
  font-weight: 400;
}

.detail-price {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.detail-price text:first-child {
  color: #f43f5e;
  font-size: 49rpx;
  font-weight: 700;
}

.address {
  gap: 7rpx;
  margin-top: 21rpx;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.address text:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.tag-row {
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 21rpx;
}

.tag {
  padding: 7rpx 21rpx;
  border-radius: 14rpx;
  font-size: 21rpx;
  font-weight: 500;
}

.tag-green {
  background: #e8fff4;
  color: #10b981;
}

.tag-blue {
  background: #eef6ff;
  color: #3b82f6;
}

.tag-orange {
  background: #fff1df;
  color: #f97316;
}

.section {
  margin-top: 14rpx;
  padding: 28rpx 0;
  background: #ffffff;
}

.section-title {
  display: block;
  margin: 0 35rpx 21rpx;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 700;
}

.section-head .section-title {
  margin-bottom: 0;
}

.month,
.more {
  margin-right: 35rpx;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28rpx;
  padding: 0 35rpx;
}

.spec-item {
  display: flex;
  height: 134rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 21rpx;
  background: #f9fafb;
}

.spec-item text:first-child {
  color: #10b981;
  font-size: 38rpx;
  font-weight: 700;
}

.spec-item text:last-child {
  margin-top: 4rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
}

.review-tabs {
  display: flex;
  gap: 14rpx;
  padding: 0 35rpx;
}

.review-tabs text {
  height: 45rpx;
  padding: 0 21rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
  line-height: 45rpx;
}

.review-tabs .active {
  background: #10b981;
  color: #ffffff;
}

.review-item {
  padding: 21rpx 35rpx 0;
}

.avatar {
  width: 65rpx;
  height: 63rpx;
  flex: 0 0 65rpx;
  border-radius: 999rpx;
}

.review-user {
  min-width: 0;
  flex: 1;
  margin-left: 14rpx;
}

.review-user > text {
  display: block;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 600;
}

.review-meta {
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 1rpx;
  font-size: 21rpx;
}

.review-content {
  display: block;
  margin-top: 14rpx;
  color: #4b5563;
  font-size: 23rpx;
  font-weight: 400;
  line-height: 1.54;
}

.submit-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  max-width: 430px;
  margin: 0 auto;
  padding: 21rpx 35rpx calc(21rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  border-top: 1rpx solid #edf0f4;
  background: #ffffff;
}

.selected {
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.total-price {
  display: flex;
  align-items: baseline;
  margin-top: 4rpx;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.total-price text:first-child {
  color: #f43f5e;
  font-size: 35rpx;
  font-weight: 700;
}

.submit-btn {
  display: flex;
  width: 218rpx;
  height: 82rpx;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
