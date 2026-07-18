<template>
  <view class="page-shell home-page">
    <view class="status-bar">
      <view class="location" @tap="go(ROUTES.LOCATION)">
        <text class="ri ri-map-pin-line"></text>
        <text>{{ store.currentCity }}市{{ store.currentRegion }}</text>
        <text class="ri ri-arrow-down-s-line down"></text>
      </view>
      <view class="right-icons">
        <view class="notice">
          <view class="red-dot"></view>
          <text class="ri ri-notification-3-line"></text>
        </view>
        <view class="scan">
          <text class="ri ri-qr-scan-line"></text>
        </view>
      </view>
    </view>

    <view class="search-wrap">
      <view class="search-box" @tap="go(ROUTES.VENUE_SEARCH)">
        <text class="ri ri-search-line"></text>
        <text>搜索运动场地、场馆名称</text>
      </view>
    </view>

    <view class="banner-section">
      <view class="banner">
        <view class="circle circle-large"></view>
        <view class="circle circle-small"></view>
        <view class="banner-content">
          <text class="banner-title">{{ primaryBanner.title }}</text>
          <text class="banner-desc">{{ primaryBanner.subTitle }}</text>
          <view class="banner-button" @tap="openBanner">立即领取</view>
        </view>
      </view>
      <view class="dots">
        <view
          v-for="index in bannerDots"
          :key="index"
          class="dot"
          :class="{ active: index === 1 }"
        ></view>
      </view>
    </view>

    <view class="home-section category-section">
      <view class="section-head">
        <text>运动类型</text>
        <view class="more" @tap="goTab(ROUTES.TAB_VENUE)">
          <text>全部</text>
          <text class="ri ri-arrow-right-s-line"></text>
        </view>
      </view>
      <view class="category-row">
        <view
          v-for="item in sportCategories"
          :key="item.id"
          class="category-item"
          @tap="selectCategory(item.id)"
        >
          <view class="category-icon" :class="item.theme">
            <text :class="['ri', item.icon]"></text>
          </view>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="home-section recommend-section">
      <view class="section-head">
        <text>热门推荐</text>
        <view class="more" @tap="goTab(ROUTES.TAB_VENUE)">
          <text>更多</text>
          <text class="ri ri-arrow-right-s-line"></text>
        </view>
      </view>

      <view
        v-for="venue in recommendVenues"
        :key="venue.id"
        class="recommend-card"
        @tap="openVenue(venue.id)"
      >
        <image class="card-cover" :src="venue.cover" mode="aspectFill" />
        <view class="card-body">
          <view class="card-title-row">
            <view class="title-tags">
              <text class="venue-title">{{ venue.name }}</text>
              <view class="tag-row">
                <text
                  v-for="(tag, index) in venue.tags"
                  :key="tag"
                  class="tag"
                  :class="`tag-${venue.tagTypes[index] || 'green'}`"
                >
                  {{ tag }}
                </text>
              </view>
            </view>
            <view class="score">
              <text class="ri ri-star-fill"></text>
              <text>{{ venue.score }}</text>
            </view>
          </view>
          <view class="card-bottom">
            <view class="address">
              <text class="ri ri-map-pin-line"></text>
              <text>{{ venue.district }} · {{ venue.address }}</text>
            </view>
            <view class="price">
              <text>¥{{ venue.minPrice }}</text>
              <text>/小时起</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <bottom-tabbar active="home" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomTabbar from '@/components/bottom-tabbar/bottom-tabbar.vue'
import { ROUTES, venueDetailRoute } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { goTab, navigateTo } from '@/utils/router'

type HomeCategory = {
  id: number
  name: string
  icon: string
  theme: string
}

type HomeBanner = {
  id: number
  title: string
  subTitle: string
  type: string
  targetUrl?: string
}

const store = useBookingStore()
const categoryMeta: Record<string, Pick<HomeCategory, 'icon' | 'theme'>> = {
  篮球: { icon: 'ri-basketball-line', theme: 'yellow' },
  羽毛球: { icon: 'ri-base-station-line', theme: 'green' },
  网球: { icon: 'ri-billiards-line', theme: 'blue' },
  足球: { icon: 'ri-football-line', theme: 'purple' },
  游泳: { icon: 'ri-drop-line', theme: 'cyan' },
  乒乓球: { icon: 'ri-ping-pong-line', theme: 'rose' }
}
const fallbackCategoryMeta = Object.values(categoryMeta)
const primaryBanner = computed<HomeBanner>(() => store.homeBanners[0] || {
  id: 1,
  title: '新用户专享',
  subTitle: '首单立减20元，快来预约吧！',
  type: 'coupon'
})
const bannerDots = computed(() => Math.max(store.homeBanners.length, 1))
const sportCategories = computed<HomeCategory[]>(() =>
  store.categories
    .filter(item => item.id !== 0)
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id,
      name: item.name,
      ...(categoryMeta[item.name] || fallbackCategoryMeta[index % fallbackCategoryMeta.length])
    }))
)
const recommendVenues = computed(() => store.recommendVenues)

onLoad(() => {
  void store.loadHomeData()
})

function go(url: string) {
  navigateTo(url)
}

function openBanner() {
  const banner = primaryBanner.value
  if (banner.targetUrl) {
    navigateTo(banner.targetUrl)
    return
  }

  if (banner.type === 'coupon') {
    navigateTo(ROUTES.COUPON)
  }
}

function selectCategory(id: number) {
  store.setCategory(id)
  goTab(ROUTES.TAB_VENUE)
}

function openVenue(id: number) {
  store.selectVenue(id)
  navigateTo(venueDetailRoute(id))
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  padding-bottom: calc(138rpx + env(safe-area-inset-bottom));
  background: #f9fafb;
  box-sizing: border-box;
}

.status-bar,
.location,
.right-icons,
.notice,
.scan,
.search-box,
.section-head,
.more,
.category-row,
.category-item,
.category-icon,
.card-title-row,
.tag-row,
.score,
.card-bottom,
.address,
.price {
  display: flex;
  align-items: center;
}

.status-bar {
  height: 63rpx;
  justify-content: space-between;
  padding: 84rpx 35rpx 21rpx;
  background: #ffffff;
}

.location {
  gap: 7rpx;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 700;
}

.location .ri-map-pin-line {
  color: #22c55e;
  font-size: 31rpx;
}

.location .down {
  color: #9ca3af;
  font-size: 28rpx;
}

.right-icons {
  gap: 28rpx;
}

.notice {
  position: relative;
  width: 38rpx;
  height: 35rpx;
  justify-content: center;
  color: #374151;
  font-size: 35rpx;
}

.red-dot {
  position: absolute;
  top: -3rpx;
  right: -3rpx;
  width: 16rpx;
  height: 14rpx;
  border-radius: 999rpx;
  background: #ef4444;
}

.scan {
  width: 63rpx;
  height: 63rpx;
  justify-content: center;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #374151;
  font-size: 31rpx;
}

.search-wrap {
  padding: 0 35rpx 28rpx;
  background: #ffffff;
}

.search-box {
  height: 77rpx;
  gap: 14rpx;
  padding: 0 28rpx;
  border-radius: 28rpx;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 24rpx;
}

.search-box .ri {
  font-size: 31rpx;
}

.banner-section {
  padding: 14rpx 35rpx 28rpx;
}

.banner {
  position: relative;
  overflow: hidden;
  height: 251rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.circle {
  position: absolute;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.12);
}

.circle-large {
  top: -3rpx;
  right: 31rpx;
  width: 169rpx;
  height: 167rpx;
  background: rgba(255, 255, 255, 0.15);
}

.circle-small {
  right: 38rpx;
  bottom: 0;
  width: 113rpx;
  height: 112rpx;
  background: rgba(255, 255, 255, 0.1);
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  justify-content: center;
  flex-direction: column;
  padding: 42rpx;
  box-sizing: border-box;
}

.banner-title {
  color: #ffffff;
  font-size: 35rpx;
  font-weight: 800;
  line-height: 49rpx;
}

.banner-desc {
  margin-top: 7rpx;
  color: rgba(255, 255, 255, 0.9);
  font-size: 24rpx;
  line-height: 35rpx;
}

.banner-button {
  width: fit-content;
  height: 56rpx;
  margin-top: 21rpx;
  padding: 0 35rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #059669;
  font-size: 23rpx;
  font-weight: 700;
  line-height: 56rpx;
}

.dots {
  display: flex;
  height: 10rpx;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  margin-top: 21rpx;
}

.dot {
  width: 12rpx;
  height: 10rpx;
  border-radius: 999rpx;
  background: #d1d5db;
}

.dot.active {
  width: 37rpx;
  background: #10b981;
}

.home-section {
  padding: 7rpx 35rpx 28rpx;
}

.section-head {
  justify-content: space-between;
  height: 45rpx;
  color: #1a1a2e;
  font-size: 30rpx;
  font-weight: 800;
}

.more {
  color: #9ca3af;
  font-size: 23rpx;
  font-weight: 400;
}

.category-row {
  justify-content: space-between;
  height: 143rpx;
  margin-top: 21rpx;
}

.category-item {
  width: 98rpx;
  height: 143rpx;
  justify-content: flex-start;
  flex-direction: column;
  color: #374151;
  font-size: 21rpx;
  font-weight: 500;
}

.category-icon {
  width: 98rpx;
  height: 98rpx;
  justify-content: center;
  border-radius: 28rpx;
  font-size: 42rpx;
}

.category-icon.yellow { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #f59e0b; }
.category-icon.green { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #10b981; }
.category-icon.blue { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #3b82f6; }
.category-icon.purple { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); color: #8b5cf6; }
.category-icon.cyan { background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%); color: #06b6d4; }
.category-icon.rose { background: linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%); color: #f43f5e; }

.category-item > text {
  margin-top: 14rpx;
  line-height: 31rpx;
}

.recommend-card {
  overflow: hidden;
  margin-top: 21rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}

.card-cover {
  display: block;
  width: 100%;
  height: 279rpx;
  background: #e5e7eb;
}

.card-body {
  padding: 28rpx;
}

.card-title-row,
.card-bottom {
  justify-content: space-between;
}

.title-tags {
  min-width: 0;
  flex: 1;
}

.venue-title {
  display: block;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 38rpx;
}

.tag-row {
  gap: 14rpx;
  margin-top: 10rpx;
}

.tag {
  height: 37rpx;
  padding: 0 14rpx;
  border-radius: 10rpx;
  font-size: 19rpx;
  font-weight: 500;
  line-height: 37rpx;
}

.tag-green { background: #f0fdf4; color: #059669; }
.tag-blue { background: #eff6ff; color: #3b82f6; }
.tag-orange { background: #fff7ed; color: #f97316; }
.tag-purple { background: #faf5ff; color: #8b5cf6; }

.score {
  gap: 7rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 700;
}

.score .ri {
  color: #f59e0b;
  font-size: 24rpx;
}

.card-bottom {
  margin-top: 21rpx;
}

.address {
  min-width: 0;
  gap: 7rpx;
  color: #9ca3af;
  font-size: 21rpx;
}

.address text:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  align-items: flex-end;
  color: #9ca3af;
}

.price text:first-child {
  color: #f43f5e;
  font-size: 35rpx;
  font-weight: 800;
  line-height: 52rpx;
}

.price text:last-child {
  margin-left: 3rpx;
  font-size: 21rpx;
  line-height: 31rpx;
}
</style>
