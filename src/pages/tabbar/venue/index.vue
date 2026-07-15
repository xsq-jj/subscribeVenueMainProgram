<template>
  <design-screen
    src="/static/calicat/venue-list.png"
    :height="1291"
    :hotspots="hotspots"
    @action="handleAction"
  >
    <view v-if="showDynamicList" class="dynamic-list">
      <view class="dynamic-toolbar">
        <text>共找到 <text class="bold">{{ filteredVenues.length }}</text> 个场地</text>
        <view class="sorts">
          <text :class="{ active: store.sort === 'recommend' }" @tap="selectSort('recommend')">推荐</text>
          <text :class="{ active: store.sort === 'distance' }" @tap="selectSort('distance')">距离</text>
          <text :class="{ active: store.sort === 'price' }" @tap="selectSort('price')">价格</text>
        </view>
      </view>
      <view
        v-for="venue in filteredVenues"
        :key="venue.id"
        class="dynamic-card"
        @tap="openVenue(venue.id)"
      >
        <image class="cover" :src="venue.cover" mode="aspectFill" />
        <view class="card-body">
          <view class="card-title-row">
            <text class="venue-name">{{ venue.name }}</text>
            <text class="score">★ {{ venue.score }}</text>
          </view>
          <view class="tag-row">
            <text v-for="tag in venue.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</text>
          </view>
          <text class="meta">{{ venue.district }} · {{ venue.address }}　{{ venue.distance }}</text>
          <view class="card-bottom">
            <text class="available">{{ venue.todayAvailableText }}</text>
            <text class="price">¥{{ venue.minPrice }}<text>/小时起</text></text>
          </view>
        </view>
      </view>
      <view v-if="filteredVenues.length === 0" class="empty">
        当前筛选下暂无场地
      </view>
    </view>
  </design-screen>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DesignScreen from '@/components/design-screen/design-screen.vue'
import { favoriteVenues } from '@/services/mock'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const showDynamicList = ref(false)

const hotspots = [
  { key: 'back', action: 'home', x: 18, y: 47, width: 34, height: 34 },
  { key: 'search', action: 'search', x: 350, y: 48, width: 34, height: 34 },
  { key: 'chip-all', action: 'category:0', x: 20, y: 88, width: 59, height: 31 },
  { key: 'chip-basketball', action: 'category:1', x: 90, y: 88, width: 59, height: 31 },
  { key: 'chip-badminton', action: 'category:2', x: 158, y: 88, width: 73, height: 31 },
  { key: 'chip-tennis', action: 'category:3', x: 235, y: 88, width: 59, height: 31 },
  { key: 'chip-football', action: 'category:4', x: 302, y: 88, width: 59, height: 31 },
  { key: 'chip-swim', action: 'category:5', x: 368, y: 88, width: 59, height: 31 },
  { key: 'sort-recommend', action: 'sort:recommend', x: 286, y: 146, width: 33, height: 22 },
  { key: 'sort-distance', action: 'sort:distance', x: 326, y: 146, width: 33, height: 22 },
  { key: 'sort-price', action: 'sort:price', x: 368, y: 146, width: 42, height: 22 },
  { key: 'card-1', action: 'detail:1', x: 20, y: 176, width: 390, height: 334 },
  { key: 'card-2', action: 'detail:2', x: 20, y: 526, width: 390, height: 335 },
  { key: 'card-3', action: 'detail:3', x: 20, y: 876, width: 390, height: 335 },
  { key: 'tab-home', action: 'home', x: 0, y: 1226, width: 108, height: 65 },
  { key: 'tab-venue', action: 'venue', x: 108, y: 1226, width: 107, height: 65 },
  { key: 'tab-order', action: 'order', x: 215, y: 1226, width: 107, height: 65 },
  { key: 'tab-profile', action: 'profile', x: 322, y: 1226, width: 108, height: 65 }
]

function handleAction(action: string) {
  if (action.startsWith('category:')) {
    store.setCategory(Number(action.split(':')[1]))
    showDynamicList.value = true
    return
  }

  if (action.startsWith('sort:')) {
    selectSort(action.split(':')[1] as 'recommend' | 'distance' | 'price')
    return
  }

  if (action.startsWith('detail:')) {
    const venueId = Number(action.split(':')[1])
    store.selectVenue(venueId)
    uni.navigateTo({ url: `/pages/venue/detail/index?id=${venueId}` })
    return
  }

  const actions: Record<string, () => void> = {
    home: () => uni.reLaunch({ url: '/pages/tabbar/home/index' }),
    venue: () => uni.reLaunch({ url: '/pages/tabbar/venue/index' }),
    order: () => uni.reLaunch({ url: '/pages/tabbar/order/index' }),
    profile: () => uni.reLaunch({ url: '/pages/tabbar/profile/index' }),
    search: () => uni.navigateTo({ url: '/pages/venue/search/index' })
  }

  actions[action]?.()
}

const filteredVenues = computed(() => {
  const list = favoriteVenues.filter(item => store.categoryId === 0 || item.categoryId === store.categoryId)

  if (store.sort === 'price') {
    return [...list].sort((a, b) => a.minPrice - b.minPrice)
  }

  if (store.sort === 'distance') {
    return [...list].sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
  }

  return list
})

function selectSort(sort: 'recommend' | 'distance' | 'price') {
  store.setSort(sort)
  showDynamicList.value = true
}

function openVenue(id: number) {
  store.selectVenue(id)
  uni.navigateTo({ url: `/pages/venue/detail/index?id=${id}` })
}
</script>

<style scoped lang="scss">
.dynamic-list {
  position: absolute;
  z-index: 3;
  top: 128px;
  right: 0;
  bottom: 65px;
  left: 0;
  overflow: hidden;
  padding: 0 20px 16px;
  background: #f9fafb;
}

.dynamic-toolbar,
.sorts,
.card-title-row,
.tag-row,
.card-bottom {
  display: flex;
  align-items: center;
}

.dynamic-toolbar {
  justify-content: space-between;
  padding: 14px 0 10px;
  color: #8b95a6;
  font-size: 13px;
}

.bold,
.sorts .active {
  color: #10b981;
  font-weight: 800;
}

.sorts {
  gap: 12px;
}

.dynamic-card {
  overflow: hidden;
  margin-bottom: 14px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.cover {
  display: block;
  width: 100%;
  height: 150px;
}

.card-body {
  padding: 14px 16px 16px;
}

.card-title-row,
.card-bottom {
  justify-content: space-between;
}

.venue-name {
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.score {
  color: #111827;
  font-size: 14px;
  font-weight: 800;
}

.tag-row {
  gap: 8px;
  margin-top: 10px;
}

.tag {
  padding: 3px 8px;
  border-radius: 6px;
  background: #e8fff4;
  color: #10b981;
  font-size: 11px;
  font-weight: 700;
}

.meta,
.available {
  color: #9aa3b2;
  font-size: 12px;
}

.meta {
  display: block;
  margin-top: 12px;
}

.card-bottom {
  margin-top: 18px;
}

.price {
  color: #f43f5e;
  font-size: 18px;
  font-weight: 900;
}

.price text {
  color: #9aa3b2;
  font-size: 11px;
}

.empty {
  padding: 60px 0;
  color: #9aa3b2;
  text-align: center;
}
</style>
