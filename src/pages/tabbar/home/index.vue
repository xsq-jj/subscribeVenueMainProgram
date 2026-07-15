<template>
  <design-screen
    src="/static/calicat/home.png"
    :height="1180"
    :hotspots="hotspots"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import DesignScreen from '@/components/design-screen/design-screen.vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()

const hotspots = [
  { key: 'location', action: 'location', x: 20, y: 48, width: 140, height: 36 },
  { key: 'search', action: 'search', x: 20, y: 96, width: 390, height: 44 },
  { key: 'category-1', action: 'category:1', x: 20, y: 384, width: 56, height: 82 },
  { key: 'category-2', action: 'category:2', x: 88, y: 384, width: 56, height: 82 },
  { key: 'category-3', action: 'category:3', x: 156, y: 384, width: 56, height: 82 },
  { key: 'category-4', action: 'category:4', x: 224, y: 384, width: 56, height: 82 },
  { key: 'category-5', action: 'category:5', x: 292, y: 384, width: 56, height: 82 },
  { key: 'category-6', action: 'category:6', x: 360, y: 384, width: 56, height: 82 },
  { key: 'more', action: 'venue', x: 340, y: 484, width: 70, height: 34 },
  { key: 'card-1', action: 'detail:1', x: 20, y: 525, width: 390, height: 282 },
  { key: 'card-2', action: 'detail:2', x: 20, y: 819, width: 390, height: 282 },
  { key: 'tab-home', action: 'home', x: 0, y: 1115, width: 108, height: 65 },
  { key: 'tab-venue', action: 'venue', x: 108, y: 1115, width: 107, height: 65 },
  { key: 'tab-order', action: 'order', x: 215, y: 1115, width: 107, height: 65 },
  { key: 'tab-profile', action: 'profile', x: 322, y: 1115, width: 108, height: 65 }
]

function handleAction(action: string) {
  if (action.startsWith('category:')) {
    store.setCategory(Number(action.split(':')[1]))
    uni.reLaunch({ url: '/pages/tabbar/venue/index' })
    return
  }

  if (action.startsWith('detail:')) {
    const venueId = Number(action.split(':')[1])
    store.selectVenue(venueId)
    uni.navigateTo({ url: `/pages/venue/detail/index?id=${venueId}` })
    return
  }

  const actions: Record<string, () => void> = {
    home: () => {
      store.setCategory(0)
      uni.reLaunch({ url: '/pages/tabbar/home/index' })
    },
    venue: () => {
      store.setCategory(0)
      uni.reLaunch({ url: '/pages/tabbar/venue/index' })
    },
    order: () => uni.reLaunch({ url: '/pages/tabbar/order/index' }),
    profile: () => uni.reLaunch({ url: '/pages/tabbar/profile/index' }),
    search: () => uni.navigateTo({ url: '/pages/venue/search/index' }),
    location: () => uni.navigateTo({ url: '/pages/location/index' })
  }

  actions[action]?.()
}
</script>
