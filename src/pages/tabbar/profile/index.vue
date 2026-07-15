<template>
  <design-screen
    src="/static/calicat/profile.png"
    :height="889"
    :hotspots="hotspots"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import DesignScreen from '@/components/design-screen/design-screen.vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()

const hotspots = [
  { key: 'my-order', action: 'order', x: 20, y: 292, width: 390, height: 70 },
  { key: 'favorite', action: 'favorite', x: 20, y: 362, width: 390, height: 58 },
  { key: 'coupon', action: 'coupon', x: 20, y: 420, width: 390, height: 58 },
  { key: 'record', action: 'record', x: 20, y: 492, width: 390, height: 58 },
  { key: 'tab-home', action: 'home', x: 0, y: 824, width: 108, height: 65 },
  { key: 'tab-venue', action: 'venue', x: 108, y: 824, width: 107, height: 65 },
  { key: 'tab-order', action: 'order', x: 215, y: 824, width: 107, height: 65 },
  { key: 'tab-profile', action: 'profile', x: 322, y: 824, width: 108, height: 65 }
]

function handleAction(action: string) {
  const actions: Record<string, () => void> = {
    home: () => uni.reLaunch({ url: '/pages/tabbar/home/index' }),
    venue: () => uni.reLaunch({ url: '/pages/tabbar/venue/index' }),
    order: () => {
      store.setOrderFilter('ALL')
      uni.reLaunch({ url: '/pages/tabbar/order/index' })
    },
    profile: () => uni.reLaunch({ url: '/pages/tabbar/profile/index' }),
    favorite: () => uni.navigateTo({ url: '/pages/favorite/index' }),
    coupon: () => uni.navigateTo({ url: '/pages/coupon/index' }),
    record: () => uni.navigateTo({ url: '/pages/sport-record/index' })
  }

  actions[action]?.()
}
</script>
