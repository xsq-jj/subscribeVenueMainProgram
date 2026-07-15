<template>
  <design-screen
    src="/static/calicat/confirm-order.png"
    :height="854"
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
  { key: 'back', action: 'back', x: 18, y: 49, width: 36, height: 36 },
  { key: 'contact', action: 'contact', x: 20, y: 313, width: 390, height: 121 },
  { key: 'coupon', action: 'coupon', x: 20, y: 448, width: 390, height: 58 },
  { key: 'remark', action: 'remark', x: 20, y: 694, width: 390, height: 68 },
  { key: 'submit', action: 'success', x: 252, y: 781, width: 166, height: 64 }
]

onLoad(query => {
  const venueId = Number(query.venueId || store.venueId || 1)
  store.selectVenue(Number.isNaN(venueId) ? 1 : venueId)
})

function handleAction(action: string) {
  const actions: Record<string, () => void> = {
    back: backToDetail,
    contact: () => uni.showToast({ title: '联系人信息已确认', icon: 'none' }),
    coupon: () => uni.navigateTo({ url: '/pages/coupon/index?from=confirm' }),
    remark: () => uni.showToast({ title: '备注功能预留', icon: 'none' }),
    success: submitOrder
  }

  actions[action]?.()
}

function submitOrder() {
  const order = store.createOrder()
  if (!order) return

  uni.showToast({ title: '预约成功', icon: 'success' })
  uni.navigateTo({ url: `/pages/order/success/index?orderId=${order.id}` })
}

function backToDetail() {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
    return
  }

  uni.navigateTo({ url: `/pages/venue/detail/index?id=${store.venueId}` })
}
</script>
