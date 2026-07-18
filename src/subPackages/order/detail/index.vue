<template>
  <view class="page-shell order-detail">
    <AppNavBar title="订单详情" :fallback-url="ROUTES.ORDER" />

    <view v-if="loading" class="surface-card state-card">
      <text>订单加载中...</text>
    </view>

    <view v-else-if="!order" class="surface-card state-card">
      <text class="state-title">订单不存在</text>
      <text class="state-desc">该订单可能已被删除，或当前账号无权查看。</text>
      <view class="state-btn" @tap="goTab(ROUTES.ORDER)">返回订单列表</view>
    </view>

    <view v-else class="surface-card detail-card">
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
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import { ROUTES } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { goTab } from '@/utils/router'
import type { SportOrder } from '@/types/domain'

const store = useBookingStore()
const order = ref<SportOrder | null>(null)
const loading = ref(false)

const statusText = computed(() => {
  if (!order.value) return ''
  if (order.value.status === 'WAIT_PAY') return '待支付'
  if (order.value.status === 'WAIT_USE') return '待使用'
  if (order.value.status === 'COMPLETED') return '已完成'
  return '已取消'
})

onLoad(query => {
  const orderId = Number(query.orderId || store.orderId)
  if (Number.isNaN(orderId) || !orderId) {
    order.value = null
    return
  }

  store.orderId = orderId
  loading.value = true
  void store.loadOrderDetail(store.orderId).then(result => {
    order.value = result
  }).finally(() => {
    loading.value = false
  })
})
</script>

<style scoped lang="scss">
.order-detail {
  padding: 0 32rpx 32rpx;
}

.detail-card {
  padding: 32rpx;
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360rpx;
  padding: 40rpx;
  color: #7f8a9b;
  font-size: 28rpx;
  font-weight: 700;
  text-align: center;
}

.state-title {
  color: #111827;
  font-size: 34rpx;
  font-weight: 900;
}

.state-desc {
  margin-top: 16rpx;
  color: #7f8a9b;
  font-size: 26rpx;
  line-height: 1.6;
}

.state-btn {
  margin-top: 28rpx;
  padding: 18rpx 36rpx;
  border-radius: 999rpx;
  background: #1ec86a;
  color: #fff;
  font-size: 26rpx;
  font-weight: 900;
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
