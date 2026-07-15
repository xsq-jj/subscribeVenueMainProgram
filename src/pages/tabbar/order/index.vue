<template>
  <view class="page-shell order-page">
    <view class="nav">
      <text class="title">我的订单</text>
    </view>

    <view class="order-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="order-tab"
        :class="{ active: store.orderFilter === tab.value }"
        @tap="store.setOrderFilter(tab.value)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <view class="order-list">
      <view
        v-for="order in store.filteredOrders"
        :key="order.id"
        class="order-card"
      >
        <view class="order-head">
          <view class="order-no">
            <text class="order-no-label">订单号：</text>
            <text>{{ order.orderNo }}</text>
          </view>
          <text :class="['status-tag', statusClass(order.status)]">
            {{ statusText(order.status) }}
          </text>
        </view>

        <view class="order-body">
          <image class="venue-cover" :src="order.venueCover" mode="aspectFill" />
          <view class="order-info">
            <text class="venue-name">{{ order.venueName }}</text>
            <view class="info-line">
              <text class="ri ri-calendar-line info-icon"></text>
              <text>{{ order.dateText }}</text>
            </view>
            <view class="info-line">
              <text class="ri ri-time-line info-icon"></text>
              <text>{{ order.timeText }} · {{ order.courtName }}</text>
            </view>
          </view>
        </view>

        <view class="order-foot">
          <view class="total">
            <text>合计：</text>
            <text :class="['amount', { muted: order.status === 'CANCELLED' }]">
              ¥{{ order.amount.toFixed(2) }}
            </text>
          </view>
          <view class="actions">
            <button
              v-if="order.status === 'WAIT_USE'"
              class="plain-btn"
              @tap="cancelOrder(order.id)"
            >
              取消预约
            </button>
            <button
              v-if="order.status === 'WAIT_USE'"
              class="primary-btn"
              @tap="openDetail(order.id)"
            >
              查看详情
            </button>
            <button
              v-if="order.status === 'COMPLETED' || order.status === 'CANCELLED'"
              class="green-outline-btn"
              @tap="repeatOrder(order.id)"
            >
              再次预约
            </button>
            <button
              v-if="order.status === 'COMPLETED'"
              class="review-btn"
              @tap="openReview"
            >
              去评价
            </button>
          </view>
        </view>
      </view>

      <view v-if="store.filteredOrders.length === 0" class="empty">
        当前状态暂无订单
      </view>
    </view>

    <view class="bottom-nav">
      <view
        v-for="item in navItems"
        :key="item.key"
        class="nav-item"
        :class="{ active: item.key === 'order' }"
        @tap="switchTab(item.url)"
      >
        <text :class="['ri', item.icon]"></text>
        <text>{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useBookingStore } from '@/stores/booking'
import type { OrderStatus } from '@/types/domain'

const store = useBookingStore()

const tabs: Array<{ label: string; value: 'ALL' | OrderStatus }> = [
  { label: '全部', value: 'ALL' },
  { label: '待使用', value: 'WAIT_USE' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
]

const navItems = [
  { key: 'home', label: '首页', icon: 'ri-home-4-line', url: '/pages/tabbar/home/index' },
  { key: 'venue', label: '场地', icon: 'ri-building-line', url: '/pages/tabbar/venue/index' },
  { key: 'order', label: '订单', icon: 'ri-file-list-3-fill', url: '/pages/tabbar/order/index' },
  { key: 'profile', label: '我的', icon: 'ri-user-line', url: '/pages/tabbar/profile/index' }
]

function statusText(status: OrderStatus) {
  if (status === 'WAIT_USE') return '待使用'
  if (status === 'COMPLETED') return '已完成'
  if (status === 'CANCELLED') return '已取消'
  return '待支付'
}

function statusClass(status: OrderStatus) {
  if (status === 'WAIT_USE') return 'pending'
  if (status === 'COMPLETED') return 'done'
  if (status === 'CANCELLED') return 'cancelled'
  return 'paying'
}

function cancelOrder(orderId: number) {
  uni.showModal({
    title: '取消预约',
    content: '确认取消该预约吗？',
    success: res => {
      if (res.confirm) store.cancelOrder(orderId)
    }
  })
}

function openDetail(orderId: number) {
  store.selectOrder(orderId)
  uni.navigateTo({ url: `/pages/order/detail/index?orderId=${orderId}` })
}

function repeatOrder(orderId: number) {
  store.repeatOrder(orderId)
  uni.navigateTo({ url: `/pages/venue/detail/index?id=${store.venueId}` })
}

function openReview() {
  uni.navigateTo({ url: '/pages/review/list/index' })
}

function switchTab(url: string) {
  if (url === '/pages/tabbar/order/index') return

  uni.reLaunch({ url })
}
</script>

<style scoped lang="scss">
.order-page {
  min-height: 100vh;
  padding-bottom: 81px;
  box-sizing: border-box;
  background: #f9fafb;
}

.nav,
.order-tabs,
.order-tab,
.order-head,
.order-no,
.order-body,
.info-line,
.order-foot,
.total,
.actions,
.bottom-nav,
.nav-item {
  display: flex;
  align-items: center;
}

.nav {
  height: 90px;
  justify-content: center;
  padding: 48px 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.title {
  display: block;
  width: 390px;
  color: #1a1a2e;
  font-size: 17px;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
}

.order-tabs {
  width: 430px;
  height: 50px;
  padding: 0 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.order-tab {
  position: relative;
  width: 97.5px;
  height: 38px;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
}

.order-tab.active {
  color: #10b981;
  font-weight: 700;
}

.order-tab.active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 44px;
  height: 4px;
  border-radius: 999px;
  background: #10b981;
  content: '';
  transform: translateX(-50%);
}

.order-list {
  padding: 12px 20px 16px;
  box-sizing: border-box;
}

.order-card {
  overflow: hidden;
  width: 390px;
  margin-bottom: 12px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.order-head {
  justify-content: space-between;
  padding: 16px 16px 8px;
  box-sizing: border-box;
}

.order-no {
  min-width: 0;
  flex: 1;
  color: #6b7280;
  font-size: 12px;
}

.order-no-label {
  color: #9ca3af;
}

.status-tag {
  min-width: 56px;
  height: 26px;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
}

.status-tag.pending {
  background: #f0fdf4;
  color: #10b981;
}

.status-tag.done {
  background: #f3f4f6;
  color: #6b7280;
}

.status-tag.cancelled {
  background: #fef2f2;
  color: #ef4444;
}

.status-tag.paying {
  background: #fffbeb;
  color: #f59e0b;
}

.order-body {
  padding: 0 16px 12px;
  box-sizing: border-box;
}

.venue-cover {
  width: 80px;
  height: 80px;
  flex: 0 0 80px;
  border-radius: 12px;
  background: #e5e7eb;
}

.order-info {
  min-width: 0;
  flex: 1;
  margin-left: 12px;
}

.venue-name {
  display: block;
  overflow: hidden;
  color: #1a1a2e;
  font-size: 15px;
  font-weight: 700;
  line-height: 23px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-line {
  height: 18px;
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
}

.info-line + .info-line {
  margin-top: 4px;
}

.info-icon {
  width: 14px;
  margin-right: 4px;
  color: #9ca3af;
  font-size: 12px;
}

.order-foot {
  justify-content: space-between;
  padding: 12px 16px 16px;
  box-sizing: border-box;
}

.total {
  min-width: 0;
  color: #9ca3af;
  font-size: 12px;
}

.amount {
  margin-left: 2px;
  color: #f43f5e;
  font-size: 18px;
  font-weight: 800;
}

.amount.muted {
  color: #d1d5db;
}

.actions {
  gap: 8px;
  justify-content: flex-end;
}

.plain-btn,
.primary-btn,
.green-outline-btn,
.review-btn {
  height: 30px;
  margin: 0;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 30px;
}

.plain-btn::after,
.primary-btn::after,
.green-outline-btn::after,
.review-btn::after {
  border: none;
}

.plain-btn {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
}

.primary-btn {
  background: #10b981;
  color: #ffffff;
}

.green-outline-btn {
  border: 1px solid #86efac;
  background: #ffffff;
  color: #10b981;
}

.review-btn {
  background: #f59e0b;
  color: #ffffff;
}

.empty {
  width: 390px;
  height: 120px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 120px;
  text-align: center;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 20;
  width: 100%;
  max-width: 430px;
  height: 65px;
  justify-content: space-between;
  padding: 8px 24px;
  box-sizing: border-box;
  background: #ffffff;
  transform: translateX(-50%);
}

.nav-item {
  width: 48px;
  height: 49px;
  justify-content: center;
  flex-direction: column;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 500;
}

.nav-item .ri {
  height: 28px;
  font-size: 20px;
}

.nav-item.active {
  color: #10b981;
  font-weight: 700;
}
</style>
