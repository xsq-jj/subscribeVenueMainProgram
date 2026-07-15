<template>
  <view class="page-shell order-detail">
    <view class="surface-card detail-card">
      <text class="title">订单详情</text>
      <view class="row"><text>订单编号</text><text>{{ order.orderNo }}</text></view>
      <view class="row"><text>订单状态</text><text>{{ statusText }}</text></view>
      <view class="row"><text>场馆名称</text><text>{{ order.venueName }}</text></view>
      <view class="row"><text>预约日期</text><text>{{ order.dateText }}</text></view>
      <view class="row"><text>预约时段</text><text>{{ order.timeText }}</text></view>
      <view class="row"><text>场地编号</text><text>{{ order.courtName }}</text></view>
      <view class="row pay"><text>支付金额</text><text>¥{{ order.amount.toFixed(2) }}</text></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const order = ref(store.currentOrder)

const statusText = computed(() => {
  if (order.value.status === 'WAIT_PAY') return '待支付'
  if (order.value.status === 'WAIT_USE') return '待使用'
  if (order.value.status === 'COMPLETED') return '已完成'
  return '已取消'
})

onLoad(query => {
  const orderId = Number(query.orderId || store.orderId || 1)
  store.selectOrder(Number.isNaN(orderId) ? 1 : orderId)
  order.value = store.getOrderById(store.orderId)
})
</script>

<style scoped lang="scss">
.order-detail {
  padding: 32rpx;
}

.detail-card {
  padding: 32rpx;
}

.title {
  display: block;
  margin-bottom: 30rpx;
  color: #111827;
  font-size: 34rpx;
  font-weight: 900;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 26rpx;
  color: #7f8a9b;
  font-size: 26rpx;
  font-weight: 700;
}

.row text:last-child {
  color: #111827;
  font-weight: 900;
}

.pay text:last-child {
  color: #ff3b6b;
  font-size: 34rpx;
}
</style>
