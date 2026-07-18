<template>
  <view class="page-shell confirm-page">
    <app-nav-bar title="确认订单" show-back />

    <view class="order-venue card">
      <image class="venue-cover" :src="venue.cover" mode="aspectFill" />
      <view class="venue-main">
        <text class="venue-name">{{ venue.name }}</text>
        <view class="score">
          <text class="star">★</text>
          <text>{{ venue.score }}分</text>
        </view>
        <view class="meta">
          <text class="ri ri-map-pin-line"></text>
          <text>{{ venue.district }} · {{ venue.address }}</text>
        </view>
      </view>
      <view class="order-lines">
        <view><text>预约日期</text><text>{{ dateText }}</text></view>
        <view><text>预约时段</text><text>{{ slot.start }} - {{ slot.end }}（2小时）</text></view>
        <view><text>场地编号</text><text>{{ courtName }} <text class="ri ri-arrow-down-s-line"></text></text></view>
      </view>
    </view>

    <view class="card info-card">
      <text class="card-title">联系人信息</text>
      <view class="row">
        <text>联系人</text>
        <text>{{ store.contactName }} <text class="ri ri-arrow-right-s-line"></text></text>
      </view>
      <view class="row">
        <text>手机号</text>
        <text>{{ store.contactPhone }} <text class="ri ri-arrow-right-s-line"></text></text>
      </view>
    </view>

    <view class="card coupon-row" @tap="go(couponUrl)">
      <view>
        <text class="ri ri-coupon-2-line coupon-icon"></text>
        <text>优惠券</text>
      </view>
      <view>
        <text class="discount">{{ couponText }}</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
    </view>

    <view class="card price-card">
      <text class="card-title">价格明细</text>
      <view class="row">
        <text>场地费（2小时 × ¥{{ slot.price }}）</text>
        <text>¥{{ fieldAmount.toFixed(2) }}</text>
      </view>
      <view class="row discount-row">
        <text>新用户优惠</text>
        <text>-¥{{ discountAmount.toFixed(2) }}</text>
      </view>
      <view class="total-row">
        <text>合计</text>
        <text>¥{{ payAmount.toFixed(2) }}</text>
      </view>
    </view>

    <view class="card remark-row">
      <text>备注</text>
      <text>选填，如特殊需求 <text class="ri ri-arrow-right-s-line"></text></text>
    </view>

    <view class="submit-bar">
      <view>
        <text class="pay-label">实付金额</text>
        <text class="pay-price">¥{{ payAmount.toFixed(2) }}</text>
      </view>
      <view class="submit-btn" @tap="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import { ROUTES, orderSuccessRoute, withQuery } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { navigateTo } from '@/utils/router'

const store = useBookingStore()

const venue = computed(() => store.currentVenue)
const slot = computed(() => store.currentSlot)
const date = computed(() => store.venueDates.find(item => item.value === store.date) || store.venueDates[0])
const dateText = computed(() => {
  if (!date.value) return store.date
  const [year, month] = date.value.value.split('-').map(Number)
  return `${year}年${month}月${date.value.day}日 ${date.value.week}`
})
const fieldAmount = computed(() => store.orderPreview?.totalAmount ?? slot.value.price * 2)
const discountAmount = computed(() => store.orderPreview?.discountAmount ?? 0)
const payAmount = computed(() => store.orderPreview?.payAmount ?? Math.max(0, fieldAmount.value - discountAmount.value))
const courtName = computed(() => slot.value.courtName || (slot.value.id === 4 ? '3号场地' : `${Math.min(slot.value.id, 3)}号场地`))
const couponText = computed(() => (store.selectedCoupon ? `${store.selectedCoupon.title}` : '请选择优惠券'))

const couponUrl = withQuery(ROUTES.COUPON, { from: 'confirm' })

onLoad(query => {
  const id = Number(query.venueId || store.venueId || 1)
  const venueId = Number.isNaN(id) ? 1 : id
  store.selectVenue(venueId)
  void store.loadVenueDetail(venueId)
  void store.loadVenueSlots(venueId, store.date).then(() => store.previewOrder())
})

function go(url: string) {
  navigateTo(url)
}

async function submitOrder() {
  const order = await store.submitOrder()
  if (!order) return
  navigateTo(orderSuccessRoute(order.id))
}
</script>

<style scoped lang="scss">
.confirm-page {
  min-height: 100vh;
  padding-bottom: calc(128rpx + env(safe-area-inset-bottom));
  background: #f6f7f9;
}

.card {
  margin: 21rpx 35rpx 0;
  padding: 28rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}

.order-venue {
  display: grid;
  grid-template-columns: 113rpx 1fr;
  column-gap: 21rpx;
}

.venue-cover {
  width: 113rpx;
  height: 112rpx;
  border-radius: 21rpx;
  background: #e5e7eb;
}

.venue-main {
  min-width: 0;
}

.venue-name {
  display: block;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 600;
}

.score,
.meta {
  display: flex;
  align-items: center;
  gap: 7rpx;
  margin-top: 7rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
}

.star {
  color: #f59e0b;
}

.order-lines {
  grid-column: 1 / 3;
  margin-top: 42rpx;
  padding-top: 21rpx;
  border-top: 1rpx solid #f3f4f6;
}

.order-lines view,
.row,
.total-row,
.coupon-row,
.coupon-row > view,
.remark-row,
.submit-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-lines view {
  margin-top: 14rpx;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.order-lines view text:last-child,
.row text:last-child,
.remark-row text:first-child {
  color: #111827;
  font-weight: 600;
}

.card-title {
  display: block;
  margin-bottom: 21rpx;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.row {
  min-height: 37rpx;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.coupon-row,
.remark-row {
  min-height: 37rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 500;
}

.coupon-row > view {
  gap: 14rpx;
}

.coupon-icon {
  color: #f59e0b;
  font-size: 31rpx;
}

.discount,
.discount-row text:last-child {
  color: #10b981;
}

.discount {
  color: #ff3b6b;
  font-size: 23rpx;
}

.total-row {
  margin-top: 21rpx;
  padding-top: 21rpx;
  border-top: 1rpx solid #f3f4f6;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.total-row text:last-child {
  color: #ff3b6b;
  font-size: 42rpx;
}

.remark-row text:last-child {
  color: #9ca3af;
  font-size: 23rpx;
  font-weight: 400;
}

.submit-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  max-width: 430px;
  margin: 0 auto;
  padding: 21rpx 35rpx calc(21rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  border-top: 1rpx solid #edf0f4;
  background: #ffffff;
}

.pay-label {
  display: block;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.pay-price {
  display: block;
  margin-top: 0;
  color: #ff3b6b;
  font-size: 42rpx;
  font-weight: 800;
}

.submit-btn {
  display: flex;
  width: 246rpx;
  height: 82rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 800;
}
</style>
