<template>
  <view class="page-shell venue-page">
    <app-nav-bar title="场地列表">
      <template #right>
        <view class="nav-actions">
          <text class="ri ri-search-line" @tap="go(ROUTES.VENUE_SEARCH)"></text>
          <text class="ri ri-filter-3-line"></text>
        </view>
      </template>
    </app-nav-bar>

    <scroll-view scroll-x class="chip-scroll" :show-scrollbar="false">
      <view class="chip-row">
        <view
          v-for="item in categories"
          :key="item.id"
          class="chip"
          :class="{ active: store.categoryId === item.id }"
          @tap="store.setCategory(item.id)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>

    <view class="toolbar">
      <text>共找到 <text class="count">{{ filteredVenues.length }}</text> 个场地</text>
      <view class="sorts">
        <text :class="{ active: store.sort === 'recommend' }" @tap="store.setSort('recommend')">推荐</text>
        <text :class="{ active: store.sort === 'distance' }" @tap="store.setSort('distance')">距离</text>
        <text :class="{ active: store.sort === 'price' }" @tap="store.setSort('price')">价格</text>
      </view>
    </view>

    <venue-card
      v-for="venue in filteredVenues"
      :key="venue.id"
      :venue="venue"
      show-distance
      show-available
      @open="openVenue"
    />

    <view v-if="filteredVenues.length === 0" class="empty">当前筛选下暂无场地</view>

    <bottom-tabbar active="venue" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import BottomTabbar from '@/components/bottom-tabbar/bottom-tabbar.vue'
import VenueCard from '@/components/venue-card/venue-card.vue'
import { ROUTES, venueDetailRoute } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { navigateTo } from '@/utils/router'

const store = useBookingStore()

const categories = computed(() => store.categories)
const filteredVenues = computed(() => store.filteredVenueList)

onShow(() => {
  void store.loadVenuePage()
})

function go(url: string) {
  navigateTo(url)
}

function openVenue(id: number) {
  store.selectVenue(id)
  navigateTo(venueDetailRoute(id))
}
</script>

<style scoped lang="scss">
.venue-page {
  min-height: 100vh;
  padding-bottom: calc(122rpx + env(safe-area-inset-bottom));
  background: #f6f7f9;
}

.nav-actions {
  display: flex;
  gap: 21rpx;
  color: #374151;
  font-size: 35rpx;
}

.chip-scroll {
  background: #ffffff;
  white-space: nowrap;
}

.chip-row {
  display: inline-flex;
  gap: 14rpx;
  padding: 0 35rpx 21rpx;
}

.chip {
  min-width: 47rpx;
  height: 56rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 500;
  line-height: 56rpx;
  text-align: center;
}

.chip.active {
  background: #10b981;
  color: #ffffff;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21rpx 35rpx;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.count,
.sorts .active {
  color: #10b981;
  font-weight: 600;
}

.sorts {
  display: flex;
  gap: 21rpx;
}

.empty {
  padding: 80rpx 0;
  color: #9aa3b2;
  font-size: 26rpx;
  text-align: center;
}
</style>
