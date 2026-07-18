<template>
  <view class="page-shell success-page">
    <view class="success-main">
      <view class="success-mark">
        <text class="ri ri-check-line"></text>
      </view>
      <text class="success-title">预约成功！</text>
      <text class="success-desc">请按时到达场馆，祝您运动愉快！</text>
    </view>

    <view class="card">
      <text class="card-title">预约详情</text>
      <view class="row"><text>订单编号</text><text>{{ order.orderNo }}</text></view>
      <view class="row"><text>场馆名称</text><text>{{ order.venueName }}</text></view>
      <view class="row"><text>预约日期</text><text>{{ order.dateText }}</text></view>
      <view class="row"><text>预约时段</text><text>{{ order.timeText }}</text></view>
      <view class="row"><text>场地编号</text><text>{{ order.courtName }}</text></view>
      <view class="row pay"><text>支付金额</text><text>¥{{ order.amount.toFixed(2) }}</text></view>
    </view>

    <view class="card tips">
      <view class="tip-title">
        <text class="ri ri-question-line"></text>
        <text>温馨提示</text>
      </view>
      <view v-for="item in tips" :key="item" class="tip-line">
        <view class="dot"></view>
        <text>{{ item }}</text>
      </view>
    </view>

    <view class="actions">
      <view class="primary" @tap="goDetail">查看订单详情</view>
      <view class="ghost" @tap="goHome">返回首页</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ROUTES, orderDetailRoute } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { goTab, navigateTo } from '@/utils/router'

const store = useBookingStore()
const order = computed(() => store.currentOrder)

const tips = [
  '请提前 10 分钟到达场馆，超时 15 分钟将自动取消预约',
  '如需取消，请在预约开始前 2 小时操作，可全额退款',
  '请穿着运动装备入场，场馆提供更衣室和淋浴设施'
]

onLoad(query => {
  const id = Number(query.orderId || store.orderId || 1)
  store.selectOrder(Number.isNaN(id) ? 1 : id)
  void store.loadOrderDetail(store.orderId)
})

function goDetail() {
  navigateTo(orderDetailRoute(store.orderId))
}

function goHome() {
  goTab(ROUTES.TAB_HOME)
}
</script>

<style scoped lang="scss">
.success-page {
  min-height: 100vh;
  padding: 0 0 42rpx;
  box-sizing: border-box;
  background: #f6f7f9;
}

.success-main {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 140rpx 35rpx 56rpx;
}

.success-mark {
  display: flex;
  width: 140rpx;
  height: 140rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #10b981;
  font-size: 63rpx;
}

.success-title {
  margin-top: 35rpx;
  color: #1a1a2e;
  font-size: 38rpx;
  font-weight: 800;
}

.success-desc {
  margin-top: 14rpx;
  color: #6b7280;
  font-size: 24rpx;
  font-weight: 400;
}

.card {
  margin: 0 35rpx 21rpx;
  padding: 35rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}

.card-title {
  display: block;
  margin-bottom: 28rpx;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.row {
  display: flex;
  min-height: 56rpx;
  align-items: center;
  justify-content: space-between;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.row text:last-child {
  color: #1a1a2e;
  font-weight: 500;
}

.row.pay {
  margin-top: 21rpx;
  padding-top: 21rpx;
  border-top: 1rpx solid #f3f4f6;
}

.row.pay text:last-child {
  color: #ff3b6b;
  font-size: 31rpx;
}

.tips {
  margin-top: 0;
}

.tip-title,
.tip-line {
  display: flex;
  align-items: center;
}

.tip-title {
  gap: 14rpx;
  margin-bottom: 21rpx;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.tip-title .ri {
  color: #f59e0b;
}

.tip-line {
  min-height: 31rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
  line-height: 1.4;
}

.dot {
  width: 12rpx;
  height: 10rpx;
  flex: 0 0 12rpx;
  margin: 8rpx 14rpx 0 0;
  border-radius: 999rpx;
  background: #10b981;
}

.actions {
  margin: 42rpx 35rpx 0;
}

.primary,
.ghost {
  display: flex;
  height: 91rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 800;
}

.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
}

.ghost {
  margin-top: 21rpx;
  background: #ffffff;
  color: #6b7280;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}
</style>
