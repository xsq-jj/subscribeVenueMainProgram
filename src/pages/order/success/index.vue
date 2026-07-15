<template>
  <design-screen
    src="/static/calicat/success.png"
    :height="865"
    :hotspots="hotspots"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import DesignScreen from '@/components/design-screen/design-screen.vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()

const hotspots = [
  { key: 'order-detail', action: 'detail', x: 20, y: 740, width: 390, height: 52 },
  { key: 'home', action: 'home', x: 20, y: 802, width: 390, height: 52 }
]

onLoad(query => {
  const orderId = Number(query.orderId || store.orderId || 1)
  store.selectOrder(Number.isNaN(orderId) ? 1 : orderId)
})

function handleAction(action: string) {
  const actions: Record<string, () => void> = {
    detail: () => uni.navigateTo({ url: `/pages/order/detail/index?orderId=${store.orderId}` }),
    home: () => uni.reLaunch({ url: '/pages/tabbar/home/index' })
  }

  actions[action]?.()
}
</script>
