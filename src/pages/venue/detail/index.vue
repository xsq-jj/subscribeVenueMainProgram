<template>
  <design-screen
    src="/static/calicat/venue-detail.png"
    :height="1319"
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
  { key: 'back', action: 'back', x: 18, y: 48, width: 40, height: 40 },
  { key: 'date-14', action: 'date:2025-01-14', x: 20, y: 604, width: 56, height: 72 },
  { key: 'date-15', action: 'date:2025-01-15', x: 85, y: 604, width: 56, height: 72 },
  { key: 'date-16', action: 'date:2025-01-16', x: 150, y: 604, width: 56, height: 72 },
  { key: 'date-17', action: 'date:2025-01-17', x: 215, y: 604, width: 56, height: 72 },
  { key: 'date-18', action: 'date:2025-01-18', x: 280, y: 604, width: 56, height: 72 },
  { key: 'date-19', action: 'date:2025-01-19', x: 345, y: 604, width: 56, height: 72 },
  { key: 'slot-1', action: 'slot:1', x: 20, y: 729, width: 125, height: 86 },
  { key: 'slot-2', action: 'slot:2', x: 153, y: 729, width: 125, height: 86 },
  { key: 'slot-3', action: 'slot:3', x: 286, y: 729, width: 125, height: 86 },
  { key: 'slot-4', action: 'slot:4', x: 20, y: 822, width: 125, height: 86 },
  { key: 'slot-5', action: 'slot:5', x: 153, y: 822, width: 125, height: 86 },
  { key: 'slot-6', action: 'slot:6', x: 286, y: 822, width: 125, height: 86 },
  { key: 'all-reviews', action: 'reviews', x: 350, y: 944, width: 60, height: 38 },
  { key: 'submit', action: 'confirm', x: 252, y: 1228, width: 166, height: 86 }
]

onLoad(query => {
  const venueId = Number(query.id || store.venueId || 1)
  store.selectVenue(Number.isNaN(venueId) ? 1 : venueId)
})

function handleAction(action: string) {
  if (action.startsWith('date:')) {
    store.selectDate(action.slice('date:'.length))
    uni.showToast({ title: '已选择预约日期', icon: 'none' })
    return
  }

  if (action.startsWith('slot:')) {
    store.selectSlot(Number(action.split(':')[1]))
    return
  }

  const actions: Record<string, () => void> = {
    back: backToList,
    reviews: () => uni.navigateTo({ url: `/pages/review/list/index?venueId=${store.venueId}` }),
    confirm: () => {
      store.selectBooking(store.venueId, store.date, store.slotId)
      uni.navigateTo({ url: `/pages/order/confirm/index?venueId=${store.venueId}` })
    }
  }

  actions[action]?.()
}

function backToList() {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
    return
  }

  uni.reLaunch({ url: '/pages/tabbar/venue/index' })
}
</script>
