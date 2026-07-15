<template>
  <view class="order-card surface-card">
    <view class="order-top">
      <view class="order-no">订单号： {{ order.orderNo }}</view>
      <view class="status" :class="statusClass">{{ statusText }}</view>
    </view>

    <view class="order-main">
      <image class="cover" mode="aspectFill" :src="order.venueCover" />
      <view class="order-info">
        <text class="venue-name">{{ order.venueName }}</text>
        <view class="line">▣ {{ order.dateText }}</view>
        <view class="line">◷ {{ order.timeText }} · {{ order.courtName }}</view>
      </view>
    </view>

    <view class="order-bottom">
      <view class="amount">
        <text class="label">合计：</text>
        <text class="price-main" :class="{ muted: order.status === 'CANCELLED' }">¥{{ order.amount.toFixed(2) }}</text>
      </view>
      <view class="actions">
        <view v-if="order.status === 'WAIT_USE'" class="action ghost">取消预约</view>
        <view v-if="order.status === 'WAIT_USE'" class="action primary" @tap="$emit('detail', order.id)">查看详情</view>
        <view v-if="order.status === 'COMPLETED'" class="action outline">再次预约</view>
        <view v-if="order.status === 'COMPLETED'" class="action warn">去评价</view>
        <view v-if="order.status === 'CANCELLED'" class="action outline">再次预约</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SportOrder } from '@/types/domain'

const props = defineProps<{
  order: SportOrder
}>()

defineEmits<{
  detail: [id: number]
}>()

const statusText = computed(() => {
  if (props.order.status === 'WAIT_USE') return '待使用'
  if (props.order.status === 'COMPLETED') return '已完成'
  return '已取消'
})

const statusClass = computed(() => {
  if (props.order.status === 'WAIT_USE') return 'status-wait'
  if (props.order.status === 'COMPLETED') return 'status-done'
  return 'status-cancel'
})
</script>

<style scoped lang="scss">
.order-card {
  margin: 0 32rpx 24rpx;
  padding: 24rpx;
}

.order-top,
.order-main,
.order-bottom,
.actions,
.amount {
  display: flex;
  align-items: center;
}

.order-top,
.order-bottom {
  justify-content: space-between;
}

.order-no {
  color: #9aa3b2;
  font-size: 23rpx;
  font-weight: 700;
}

.status {
  padding: 8rpx 14rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 900;
}

.status-wait {
  background: #e7fff4;
  color: #10b981;
}

.status-done {
  background: #f4f5f7;
  color: #7a8494;
}

.status-cancel {
  background: #fff0f2;
  color: #f43f5e;
}

.order-main {
  align-items: flex-start;
  margin-top: 18rpx;
}

.cover {
  width: 112rpx;
  height: 112rpx;
  flex: 0 0 112rpx;
  border-radius: 14rpx;
  background: #dbe3ea;
}

.order-info {
  min-width: 0;
  margin-left: 22rpx;
}

.venue-name {
  display: block;
  margin: 4rpx 0 16rpx;
  color: #111827;
  font-size: 29rpx;
  font-weight: 900;
}

.line {
  margin-top: 8rpx;
  color: #7f8a9b;
  font-size: 24rpx;
  font-weight: 600;
}

.order-bottom {
  margin-top: 26rpx;
}

.label {
  color: #7f8a9b;
  font-size: 25rpx;
}

.price-main {
  color: #ff3b6b;
  font-size: 34rpx;
  font-weight: 900;
}

.price-main.muted {
  color: #c4cad3;
}

.actions {
  gap: 14rpx;
}

.action {
  min-width: 116rpx;
  padding: 13rpx 18rpx;
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 900;
  text-align: center;
}

.action.ghost {
  border: 1rpx solid #e5e8ee;
  color: #7f8a9b;
}

.action.primary {
  background: #10b981;
  color: #fff;
}

.action.outline {
  border: 1rpx solid #10b981;
  color: #10b981;
}

.action.warn {
  background: #f59e0b;
  color: #fff;
}
</style>
