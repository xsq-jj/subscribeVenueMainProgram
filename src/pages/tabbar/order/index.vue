<template>
  <view class="page-shell order-page">
    <app-nav-bar title="我的订单" />

    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: store.orderFilter === tab.value }"
        @tap="store.setOrderFilter(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <view class="order-list">
      <view v-if="store.loadingOrders" class="empty">订单加载中...</view>
      <view v-else-if="store.orderError && store.filteredOrders.length === 0" class="empty">
        <text>{{ store.orderError }}</text>
        <view class="retry-btn" @tap="store.loadOrders()">重试</view>
      </view>
      <template v-else>
      <view v-for="order in store.filteredOrders" :key="order.id" class="order-card">
        <view class="order-top">
          <text>订单号：{{ order.orderNo }}</text>
          <text class="status" :class="statusClass(order.status)">{{ statusText(order.status) }}</text>
        </view>
        <view class="order-main">
          <image class="cover" :src="order.venueCover" mode="aspectFill" />
          <view class="info">
            <text class="venue-name">{{ order.venueName }}</text>
            <view class="line"><text class="ri ri-calendar-line"></text><text>{{ order.dateText }}</text></view>
            <view class="line"><text class="ri ri-time-line"></text><text>{{ order.timeText }} · {{ order.courtName }}</text></view>
          </view>
        </view>
        <view class="order-bottom">
          <view class="amount">
            <text>合计：</text>
            <text :class="{ muted: order.status === 'CANCELLED' }">¥{{ order.amount.toFixed(2) }}</text>
          </view>
          <view class="actions">
            <view v-if="order.status === 'WAIT_USE'" class="btn ghost" @tap="cancelOrder(order.id)">取消预约</view>
            <view v-if="order.status === 'WAIT_USE'" class="btn outline" @tap="completeOrder(order.id)">完成</view>
            <view v-if="order.status === 'WAIT_USE'" class="btn primary" @tap="openDetail(order.id)">查看详情</view>
            <view v-if="order.status !== 'WAIT_USE'" class="btn outline" @tap="repeatOrder(order.id)">再次预约</view>
            <view v-if="order.status === 'COMPLETED'" class="btn warn" @tap="openReviews(order.venueId)">去评价</view>
          </view>
        </view>
      </view>
      <view v-if="store.filteredOrders.length === 0" class="empty">当前状态暂无订单</view>
      </template>
    </view>

    <bottom-tabbar active="order" />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import BottomTabbar from '@/components/bottom-tabbar/bottom-tabbar.vue'
import { ROUTES, orderDetailRoute, venueDetailRoute, withQuery } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import type { OrderStatus } from '@/types/domain'
import { navigateTo } from '@/utils/router'

const store = useBookingStore()

const tabs: Array<{ label: string; value: 'ALL' | OrderStatus }> = [
  { label: '全部', value: 'ALL' },
  { label: '待使用', value: 'WAIT_USE' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
]

onShow(() => {
  void store.loadOrders()
})

function statusText(status: OrderStatus) {
  if (status === 'WAIT_USE') return '待使用'
  if (status === 'COMPLETED') return '已完成'
  if (status === 'CANCELLED') return '已取消'
  return '待支付'
}

function statusClass(status: OrderStatus) {
  if (status === 'WAIT_USE') return 'wait'
  if (status === 'COMPLETED') return 'done'
  if (status === 'CANCELLED') return 'cancel'
  return 'pay'
}

function openDetail(id: number) {
  store.selectOrder(id)
  navigateTo(orderDetailRoute(id))
}

function openReviews(venueId?: number) {
  navigateTo(withQuery(ROUTES.REVIEW_LIST, { venueId: venueId || store.venueId }))
}

function repeatOrder(id: number) {
  store.repeatOrder(id)
  navigateTo(venueDetailRoute(store.venueId))
}

function cancelOrder(id: number) {
  uni.showModal({
    title: '取消预约',
    content: '确认取消该预约吗？',
    success: res => {
      if (res.confirm) void store.cancelOrder(id)
    }
  })
}

function completeOrder(id: number) {
  uni.showModal({
    title: '完成订单',
    content: '确认将该预约标记为已完成，并生成运动记录吗？',
    success: res => {
      if (res.confirm) void store.completeOrder(id)
    }
  })
}
</script>

<style scoped lang="scss">
.order-page {
  min-height: 100vh;
  padding-bottom: calc(122rpx + env(safe-area-inset-bottom));
  background: #f6f7f9;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 87rpx;
  padding: 0 35rpx 21rpx;
  background: #ffffff;
  box-sizing: content-box;
}

.tab {
  position: relative;
  color: #6b7280;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 37rpx;
  text-align: center;
}

.tab.active {
  color: #10b981;
  font-weight: 800;
}

.tab.active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 77rpx;
  height: 7rpx;
  border-radius: 999rpx;
  background: #10b981;
  content: '';
  transform: translateX(-50%);
}

.order-list {
  padding: 21rpx 35rpx 28rpx;
}

.order-card {
  margin-bottom: 21rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}

.order-top,
.order-main,
.line,
.order-bottom,
.amount,
.actions {
  display: flex;
  align-items: center;
}

.order-top,
.order-bottom {
  justify-content: space-between;
}

.order-top {
  color: #8b95a6;
  font-size: 21rpx;
  font-weight: 400;
}

.status {
  padding: 7rpx 17rpx;
  border-radius: 10rpx;
  font-size: 21rpx;
  font-weight: 600;
}

.status.wait { background: #e8fff4; color: #10b981; }
.status.done { background: #f3f4f6; color: #6b7280; }
.status.cancel { background: #fff0f2; color: #ef4444; }
.status.pay { background: #fffbeb; color: #f59e0b; }

.order-main {
  align-items: flex-start;
  margin-top: 21rpx;
}

.cover {
  width: 141rpx;
  height: 140rpx;
  flex: 0 0 141rpx;
  border-radius: 21rpx;
  background: #e5e7eb;
}

.info {
  min-width: 0;
  flex: 1;
  margin-left: 21rpx;
}

.venue-name {
  display: block;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 600;
}

.line {
  gap: 7rpx;
  margin-top: 7rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
}

.order-bottom {
  margin-top: 21rpx;
}

.amount {
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.amount text:last-child {
  color: #ff3b6b;
  font-size: 31rpx;
  font-weight: 800;
}

.amount .muted {
  color: #c4cad3;
}

.actions {
  gap: 14rpx;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn {
  min-width: 0;
  height: 52rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  font-size: 21rpx;
  font-weight: 600;
  line-height: 52rpx;
  text-align: center;
}

.btn.ghost {
  border: 1rpx solid #e5e7eb;
  color: #6b7280;
}

.btn.primary {
  background: #10b981;
  color: #ffffff;
}

.btn.outline {
  border: 1rpx solid #86efac;
  color: #10b981;
}

.btn.warn {
  background: #f59e0b;
  color: #ffffff;
}

.empty {
  padding: 80rpx 0;
  color: #9aa3b2;
  font-size: 26rpx;
  text-align: center;
}

.retry-btn {
  width: fit-content;
  margin: 22rpx auto 0;
  padding: 14rpx 34rpx;
  border-radius: 999rpx;
  background: #10b981;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
