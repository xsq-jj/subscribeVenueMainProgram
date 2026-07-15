<template>
  <view class="page-shell coupon-page">
    <view class="nav">
      <text class="ri ri-arrow-left-s-line back" @tap="back"></text>
      <text class="title">优惠券</text>
      <view class="rule" @tap="showRules">
        <text class="ri ri-question-line rule-icon"></text>
        <text>规则</text>
      </view>
    </view>

    <view class="summary-wrap">
      <view class="summary">
        <view class="summary-main">
          <text class="summary-label">可用优惠券</text>
          <view class="summary-count"><text>{{ store.couponStats.available }}</text> 张</view>
          <text class="summary-tip">最高可省 ¥50</text>
        </view>
        <view class="ticket-mark">
          <text class="ri ri-coupon-2-line"></text>
        </view>
      </view>
    </view>

    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: store.couponFilter === tab.value }"
          @tap="store.setCouponFilter(tab.value)"
        >
          <text>{{ tab.label }}</text>
        </view>
      </view>
    </view>

    <view class="coupon-list">
      <view
        v-for="coupon in store.filteredCoupons"
        :key="coupon.id"
        class="coupon-card"
        :class="[coupon.theme, { disabled: coupon.status !== 'AVAILABLE' }]"
      >
        <view class="coupon-value">
          <view class="value-line">
            <text v-if="valuePrefix(coupon.valueText)" class="prefix">{{ valuePrefix(coupon.valueText) }}</text>
            <text class="value">{{ valueMain(coupon.valueText) }}</text>
          </view>
          <text class="threshold">{{ valueUnit(coupon.valueText) || coupon.thresholdText }}</text>
        </view>
        <view class="coupon-main">
          <text class="coupon-title">{{ coupon.title }}</text>
          <text class="coupon-desc">{{ coupon.description }}</text>
          <view class="expire-row">
            <text class="ri ri-time-line clock"></text>
            <text>{{ coupon.expireText }}</text>
          </view>
          <button
            class="use-btn"
            :class="coupon.theme"
            :disabled="coupon.status !== 'AVAILABLE'"
            @tap="useCoupon(coupon.id)"
          >
            {{ coupon.status === 'AVAILABLE' ? '立即使用' : statusText(coupon.status) }}
          </button>
        </view>
      </view>

      <view v-if="store.filteredCoupons.length === 0" class="empty">
        当前状态暂无优惠券
      </view>
    </view>

    <view class="section-gap" />

    <view class="claim-section">
      <view class="claim-card" @tap="claimCoupon">
        <view class="gift">
          <text class="ri ri-gift-2-line"></text>
        </view>
        <view class="claim-text">
          <text class="claim-title">领券中心</text>
          <text class="claim-desc">更多优惠券等你来领</text>
        </view>
        <text class="ri ri-arrow-right-s-line claim-arrow"></text>
      </view>
    </view>

    <view class="section-gap" />

    <view class="rules-section">
      <text class="rules-title">使用说明</text>
      <view class="rule-line" v-for="item in ruleItems" :key="item">
        <view class="dot"></view>
        <text>{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useBookingStore } from '@/stores/booking'
import type { CouponStatus } from '@/types/domain'

const store = useBookingStore()

const tabs: Array<{ label: string; value: 'AVAILABLE' | 'USED' | 'EXPIRED' }> = [
  { label: '可使用', value: 'AVAILABLE' },
  { label: '已使用', value: 'USED' },
  { label: '已过期', value: 'EXPIRED' }
]

const ruleItems = [
  '优惠券仅限在运动场地预约小程序内使用',
  '每笔订单仅限使用一张优惠券，不可叠加',
  '优惠券不可兑换现金，过期自动失效',
  '如发生退款，已使用的优惠券不予退还'
]

function statusText(status: CouponStatus) {
  if (status === 'USED') return '已使用'
  if (status === 'EXPIRED') return '已过期'
  return '立即使用'
}

function valuePrefix(text: string) {
  return text.startsWith('¥') ? '¥' : ''
}

function valueMain(text: string) {
  return text.replace('¥', '').replace('折', '')
}

function valueUnit(text: string) {
  return text.includes('折') ? '折' : ''
}

function back() {
  uni.navigateBack()
}

function useCoupon(id: number) {
  if (!store.selectCoupon(id)) return

  const pages = getCurrentPages()
  const previousPage = pages[pages.length - 2]
  if (previousPage?.route === 'pages/order/confirm/index') {
    uni.navigateBack()
    return
  }

  uni.navigateTo({ url: `/pages/venue/detail/index?id=${store.venueId}` })
}

function claimCoupon() {
  store.setCouponFilter('AVAILABLE')
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
  box-sizing: border-box;
  background: #f9fafb;
}

.nav,
.rule,
.summary,
.tabs,
.tab,
.coupon-card,
.coupon-value,
.coupon-main,
.expire-row,
.claim-card,
.gift,
.rule-line {
  display: flex;
  align-items: center;
}

.nav {
  height: 90px;
  padding: 48px 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.back {
  width: 22px;
  margin-right: 13px;
  color: #111827;
  font-size: 30px;
  line-height: 1;
}

.title {
  flex: 1;
  color: #1a1a2e;
  font-size: 17px;
  font-weight: 700;
  line-height: 26px;
}

.rule {
  width: 52px;
  justify-content: flex-end;
  gap: 5px;
  color: #6b7280;
  font-size: 13px;
}

.rule-icon {
  color: #9ca3af;
  font-size: 18px;
}

.summary-wrap {
  padding: 0 20px 16px;
  box-sizing: border-box;
  background: #ffffff;
}

.summary {
  width: 390px;
  height: 118px;
  justify-content: space-between;
  padding: 16px 20px;
  box-sizing: border-box;
  border-radius: 16px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.summary-main {
  min-width: 0;
  flex: 1;
}

.summary-label,
.summary-tip {
  display: block;
  color: #059669;
  font-size: 13px;
}

.summary-count {
  height: 44px;
  margin-top: 4px;
  color: #059669;
  font-size: 14px;
  font-weight: 700;
}

.summary-count text {
  font-size: 36px;
  font-weight: 900;
}

.ticket-mark {
  display: flex;
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.55);
  color: #10b981;
  font-size: 28px;
}

.tabs-wrap {
  padding: 0 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.tabs {
  width: 390px;
  height: 45px;
}

.tab {
  position: relative;
  width: 130px;
  height: 45px;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 700;
}

.tab.active {
  color: #10b981;
}

.tab.active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 33px;
  height: 3px;
  border-radius: 3px;
  background: #10b981;
  content: '';
  transform: translateX(-50%);
}

.coupon-list {
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
}

.coupon-card {
  overflow: hidden;
  width: 390px;
  height: 132px;
  margin-bottom: 12px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.coupon-value {
  width: 100px;
  height: 132px;
  justify-content: center;
  flex-direction: column;
  color: #ffffff;
}

.value-line {
  display: flex;
  align-items: flex-end;
}

.prefix {
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 800;
}

.value {
  font-size: 36px;
  font-weight: 900;
  line-height: 43px;
}

.threshold {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
}

.green .coupon-value {
  background: #10b981;
}

.purple .coupon-value {
  background: #8b5cf6;
}

.orange .coupon-value {
  background: #f59e0b;
}

.coupon-main {
  position: relative;
  width: 290px;
  height: 132px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 14px 16px;
  box-sizing: border-box;
}

.coupon-title {
  max-width: 258px;
  overflow: hidden;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-desc {
  display: block;
  max-width: 258px;
  overflow: hidden;
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expire-row {
  gap: 5px;
  margin-top: 8px;
  color: #f59e0b;
  font-size: 12px;
}

.clock {
  color: #f59e0b;
  font-size: 13px;
}

.use-btn {
  width: 258px;
  height: 24px;
  margin: 8px 0 0;
  padding: 0;
  border-radius: 999px;
  background: #d1fae5;
  color: #10b981;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
}

.use-btn::after {
  border: none;
}

.use-btn.purple {
  background: #ede9fe;
  color: #8b5cf6;
}

.use-btn.orange {
  background: #fef3c7;
  color: #d97706;
}

.disabled {
  opacity: 0.55;
}

.section-gap {
  width: 430px;
  height: 8px;
  background: #f3f4f6;
}

.claim-section,
.rules-section {
  padding: 16px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.claim-card {
  width: 390px;
  height: 68px;
  padding: 14px 16px;
  box-sizing: border-box;
  border: 1px solid #fde68a;
  border-radius: 12px;
  background: #fffbeb;
}

.gift {
  width: 40px;
  height: 40px;
  justify-content: center;
  border-radius: 20px;
  background: #fef3c7;
  color: #f59e0b;
  font-size: 20px;
}

.gift .ri {
  width: 22px;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
}

.claim-text {
  min-width: 0;
  flex: 1;
  margin-left: 13px;
}

.claim-title {
  display: block;
  color: #92400e;
  font-size: 14px;
  font-weight: 700;
}

.claim-desc {
  display: block;
  margin-top: 2px;
  color: #b45309;
  font-size: 12px;
}

.claim-arrow {
  color: #f59e0b;
  font-size: 20px;
}

.rules-title {
  display: block;
  margin-bottom: 10px;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
}

.rule-line {
  min-height: 28px;
  color: #6b7280;
  font-size: 13px;
  line-height: 20px;
}

.dot {
  width: 7px;
  height: 6px;
  flex: 0 0 7px;
  margin-right: 9px;
  border-radius: 999px;
  background: #d1d5db;
}

.empty {
  height: 72px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 72px;
  text-align: center;
}
</style>
