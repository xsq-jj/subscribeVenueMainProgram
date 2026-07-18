<template>
  <view class="page-shell coupon-page">
    <view class="coupon-nav">
      <view class="nav-left" @tap="goBack()">
        <text class="ri ri-arrow-left-s-line"></text>
        <text class="nav-title">优惠券</text>
      </view>
      <view class="nav-rule" @tap="showRules">
        <text class="ri ri-question-line"></text>
        <text>规则</text>
      </view>
    </view>

    <view class="summary">
      <view>
        <text class="summary-label">可用优惠券</text>
        <view class="summary-count"><text>{{ store.couponStats.available }}</text> 张</view>
        <text class="summary-tip">最高可省 ¥50</text>
      </view>
      <view class="summary-icon"><text class="ri ri-coupon-2-line"></text></view>
    </view>

    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: store.couponFilter === tab.value }"
        @tap="store.setCouponFilter(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <view class="coupon-list">
      <view v-if="store.loadingCoupons" class="state-box">优惠券加载中...</view>
      <view v-else-if="store.couponError && store.filteredCoupons.length === 0" class="state-box">
        <text>{{ store.couponError }}</text>
        <view class="retry-btn" @tap="store.loadCoupons()">重试</view>
      </view>
      <template v-else>
      <view v-if="store.couponError" class="warn-line">{{ store.couponError }}</view>
      <view
        v-for="coupon in store.filteredCoupons"
        :key="coupon.id"
        class="coupon-card"
        :class="[coupon.theme, { disabled: coupon.status !== 'AVAILABLE' }]"
      >
        <view class="coupon-value">
          <view class="amount-row" :class="{ discount: coupon.valueText.includes('折') }">
            <text v-if="coupon.valueText.includes('¥')" class="currency">¥</text>
            <text class="value">{{ couponAmount(coupon.valueText) }}</text>
          </view>
          <text v-if="coupon.valueText.includes('折')" class="unit">折</text>
          <text v-else class="threshold">{{ coupon.thresholdText }}</text>
        </view>

        <view class="coupon-main">
          <text class="coupon-title">{{ coupon.title }}</text>
          <text class="coupon-desc">{{ coupon.description }}</text>
          <view class="expire">
            <text class="ri ri-time-line"></text>
            <text>{{ coupon.expireText }}</text>
          </view>
          <view class="use-btn" :class="coupon.theme" @tap="useCoupon(coupon.id)">
            {{ coupon.status === 'AVAILABLE' ? '立即使用' : statusText(coupon.status) }}
          </view>
        </view>
      </view>

      <view v-if="store.filteredCoupons.length === 0" class="empty">当前状态暂无优惠券</view>
      </template>
    </view>

    <view class="claim" @tap="store.setCouponFilter('AVAILABLE')">
      <view class="gift"><text class="ri ri-gift-2-line"></text></view>
      <view class="claim-text">
        <text class="claim-title">领券中心</text>
        <text class="claim-desc">更多优惠券等你来领</text>
      </view>
      <text class="ri ri-arrow-right-s-line claim-arrow"></text>
    </view>

    <view class="rules">
      <text class="rules-title">使用说明</text>
      <view v-for="item in ruleItems" :key="item" class="rule-line">
        <view class="dot"></view>
        <text>{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ROUTES, venueDetailRoute } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import type { CouponStatus } from '@/types/domain'
import { goBack, navigateTo } from '@/utils/router'

const store = useBookingStore()

onShow(() => {
  void store.loadCoupons()
})

const tabs: Array<{ label: string; value: 'AVAILABLE' | 'USED' | 'EXPIRED' }> = [
  { label: '可使用', value: 'AVAILABLE' },
  { label: '已使用', value: 'USED' },
  { label: '已过期', value: 'EXPIRED' }
]

const ruleItems = [
  '优惠券仅限在运动场地预约小程序内使用',
  '每笔订单仅限使用一张优惠券，不可叠加',
  '优惠券不可兑换现金，过期自动失效',
  '如发生退款，已使用的优惠券不予退回'
]

function couponAmount(valueText: string) {
  return valueText.replace('¥', '').replace('折', '')
}

function statusText(status: CouponStatus) {
  if (status === 'USED') return '已使用'
  if (status === 'EXPIRED') return '已过期'
  return '立即使用'
}

function useCoupon(id: number) {
  if (!store.selectCoupon(id)) return
  const pages = getCurrentPages()
  const previous = pages[pages.length - 2]
  if (previous?.route && `/${previous.route}` === ROUTES.ORDER_CONFIRM) {
    goBack()
  } else {
    navigateTo(venueDetailRoute(store.venueId))
  }
}

function showRules() {
  uni.showModal({
    title: '优惠券规则',
    content: '每笔订单仅可使用一张优惠券，提交订单时以当前可用优惠券为准。',
    showCancel: false
  })
}
</script>

<style scoped lang="scss">
.coupon-page {
  min-height: 100vh;
  background: #f6f7f9;
}

.coupon-nav {
  display: flex;
  height: 157rpx;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 35rpx 31rpx;
  box-sizing: border-box;
  background: #ffffff;
}

.nav-left,
.nav-rule,
.amount-row,
.expire,
.claim,
.rule-line {
  display: flex;
  align-items: center;
}

.nav-left {
  min-width: 0;
  gap: 21rpx;
  color: #111827;
}

.nav-left .ri {
  font-size: 38rpx;
}

.nav-title {
  color: #111827;
  font-size: 31rpx;
  font-weight: 800;
  line-height: 38rpx;
}

.nav-rule {
  gap: 9rpx;
  color: #9aa3b2;
  font-size: 23rpx;
  font-weight: 500;
}

.nav-rule .ri {
  font-size: 31rpx;
}

.summary {
  display: flex;
  min-height: 206rpx;
  align-items: center;
  justify-content: space-between;
  margin: 0 35rpx 28rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #c6f9dd 0%, #a9f1c9 100%);
  box-sizing: border-box;
}

.summary-label,
.summary-tip {
  display: block;
  color: #059669;
  font-size: 23rpx;
  font-weight: 400;
}

.summary-count {
  margin-top: 7rpx;
  color: #059669;
  font-size: 24rpx;
  font-weight: 400;
}

.summary-count text {
  font-size: 63rpx;
  font-weight: 800;
}

.summary-icon {
  display: flex;
  width: 98rpx;
  height: 98rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.48);
  color: #10b981;
  font-size: 49rpx;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 99rpx;
  padding: 0 35rpx;
  border-bottom: 1rpx solid #f3f4f6;
  background: #ffffff;
  box-sizing: border-box;
}

.tab {
  position: relative;
  color: #9ca3af;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 68rpx;
  text-align: center;
}

.tab.active {
  color: #10b981;
  font-weight: 800;
}

.tab.active::after {
  position: absolute;
  bottom: 24rpx;
  left: 50%;
  width: 58rpx;
  height: 5rpx;
  border-radius: 999rpx;
  background: #10b981;
  content: '';
  transform: translateX(-50%);
}

.coupon-list {
  padding: 28rpx 35rpx;
}

.coupon-card {
  display: flex;
  overflow: hidden;
  min-height: 230rpx;
  margin-bottom: 21rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.04);
}

.coupon-value {
  display: flex;
  width: 174rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #ffffff;
  font-weight: 700;
}

.amount-row {
  justify-content: center;
  line-height: 1;
}

.amount-row.discount {
  margin-top: 0;
}

.currency {
  margin-right: 4rpx;
  padding-top: 28rpx;
  font-size: 21rpx;
  font-weight: 800;
}

.value {
  font-size: 77rpx;
  font-weight: 800;
  line-height: 1;
}

.threshold,
.unit {
  margin-top: 4rpx;
  font-size: 19rpx;
  line-height: 28rpx;
}

.unit {
  font-size: 26rpx;
  font-weight: 800;
}

.green .coupon-value { background: #10b981; }
.purple .coupon-value { background: #8b5cf6; }
.orange .coupon-value { background: #f59e0b; }

.coupon-main {
  min-width: 0;
  flex: 1;
  padding: 24rpx 28rpx;
}

.coupon-title {
  display: block;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 800;
}

.coupon-desc {
  display: block;
  margin-top: 7rpx;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.expire {
  gap: 9rpx;
  margin-top: 14rpx;
  color: #f59e0b;
  font-size: 21rpx;
  font-weight: 400;
}

.use-btn {
  height: 45rpx;
  margin-top: 14rpx;
  border-radius: 999rpx;
  font-size: 21rpx;
  font-weight: 600;
  line-height: 45rpx;
  text-align: center;
}

.use-btn.green { background: #d1fae5; color: #10b981; }
.use-btn.purple { background: #ede9fe; color: #8b5cf6; }
.use-btn.orange { background: #fef3c7; color: #d97706; }

.disabled {
  opacity: 0.55;
}

.claim {
  min-height: 119rpx;
  margin: 28rpx 35rpx;
  padding: 0 28rpx;
  border: 1rpx solid #fde68a;
  border-radius: 21rpx;
  background: #fffbeb;
  box-sizing: border-box;
}

.gift {
  display: flex;
  width: 70rpx;
  height: 70rpx;
  align-items: center;
  justify-content: center;
  margin-right: 23rpx;
  border-radius: 999rpx;
  background: #fef3c7;
  color: #f59e0b;
  font-size: 35rpx;
}

.claim-text {
  min-width: 0;
  flex: 1;
}

.claim-title,
.rules-title {
  display: block;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.claim-desc {
  display: block;
  margin-top: 3rpx;
  color: #b45309;
  font-size: 21rpx;
  font-weight: 400;
}

.claim-arrow {
  color: #f59e0b;
  font-size: 38rpx;
}

.rules {
  margin-top: 14rpx;
  padding: 35rpx;
  background: #ffffff;
}

.rule-line {
  align-items: flex-start;
  margin-top: 14rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
  line-height: 1.4;
}

.dot {
  width: 12rpx;
  height: 10rpx;
  flex: 0 0 12rpx;
  margin: 7rpx 16rpx 0 0;
  border-radius: 999rpx;
  background: #cbd5e1;
}

.empty {
  padding: 80rpx 0;
  color: #9aa3b2;
  font-size: 26rpx;
  text-align: center;
}

.state-box {
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

.warn-line {
  margin-bottom: 21rpx;
  padding: 18rpx 22rpx;
  border-radius: 18rpx;
  background: #fffbeb;
  color: #b45309;
  font-size: 22rpx;
}
</style>
