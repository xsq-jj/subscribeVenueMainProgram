<template>
  <view class="page-shell profile-page">
    <view class="profile-hero">
      <view class="settings" @tap="open(ROUTES.SETTINGS)">
        <text class="ri ri-settings-3-line"></text>
      </view>
      <view class="user-row" @tap="handleUserTap">
        <image class="avatar" :src="user.avatar" mode="aspectFill" />
        <view class="user-main">
          <text class="name">{{ user.isAuthorized ? user.nickName : '点击授权登录' }}</text>
          <text class="level">{{ user.isAuthorized ? user.level : '授权后同步会员权益' }}</text>
        </view>
        <button v-if="!user.isAuthorized" class="auth-button" :disabled="authorizing" @tap.stop="handleAuthorize">
          {{ authorizing ? '授权中' : '一键授权' }}
        </button>
        <text v-else class="ri ri-arrow-right-s-line user-arrow"></text>
      </view>
    </view>

    <view v-if="!user.isAuthorized" class="auth-card">
      <text class="auth-title">完成授权后使用订单、收藏和优惠券</text>
      <text class="auth-desc">授权后将通过微信登录获取后端 token，用于同步订单、收藏和优惠券。</text>
      <button class="primary-auth" :disabled="authorizing" @tap="handleAuthorize">
        {{ authorizing ? '授权中...' : '一键授权' }}
      </button>
    </view>

    <view class="stats-card">
      <view class="stat"><text>{{ store.recordStats.count }}</text><text>运动次数</text></view>
      <view class="divider"></view>
      <view class="stat"><text>{{ store.recordStats.hours }}h</text><text>累计时长</text></view>
      <view class="divider"></view>
      <view class="stat orange"><text>{{ store.couponStats.available }}</text><text>优惠券</text></view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @tap="goOrder">
        <view class="menu-icon green"><text class="ri ri-file-list-3-line"></text></view>
        <text>我的订单</text>
        <text class="menu-extra">全部</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="menu-item" @tap="open(ROUTES.FAVORITE)">
        <view class="menu-icon yellow"><text class="ri ri-heart-line"></text></view>
        <text>我的收藏</text>
        <text class="menu-extra">{{ store.favoriteTotal }}个场馆</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="menu-item" @tap="open(ROUTES.COUPON)">
        <view class="menu-icon purple"><text class="ri ri-coupon-2-line"></text></view>
        <text>优惠券</text>
        <text class="menu-extra red">{{ store.couponStats.available }}张可用</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @tap="open(ROUTES.SPORT_RECORD)">
        <view class="menu-icon blue"><text class="ri ri-time-line"></text></view>
        <text>运动记录</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="menu-item">
        <view class="menu-icon pink"><text class="ri ri-user-line"></text></view>
        <text>常用联系人</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="menu-item">
        <view class="menu-icon gray"><text class="ri ri-question-line"></text></view>
        <text>帮助中心</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="menu-item">
        <view class="menu-icon gray"><text class="ri ri-question-line"></text></view>
        <text>关于我们</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
    </view>

    <view v-if="user.isAuthorized" class="logout" @tap="handleLogout">退出授权</view>
    <bottom-tabbar active="profile" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BottomTabbar from '@/components/bottom-tabbar/bottom-tabbar.vue'
import { ROUTES } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { useUserStore } from '@/stores/user'
import { goTab, navigateTo } from '@/utils/router'

const store = useBookingStore()
const user = useUserStore()
const authorizing = ref(false)

onShow(() => {
  void store.loadCoupons()
  void store.loadFavorites()
  void store.loadRecordData()
})

function open(url: string) {
  navigateTo(url)
}

function goOrder() {
  store.setOrderFilter('ALL')
  goTab(ROUTES.TAB_ORDER)
}

function handleUserTap() {
  if (user.isAuthorized) {
    open(ROUTES.PROFILE_INFO)
    return
  }

  handleAuthorize()
}

async function handleAuthorize() {
  if (user.isAuthorized || authorizing.value) {
    return
  }

  authorizing.value = true
  const success = await user.authorizeProfile()
  authorizing.value = false

  uni.showToast({
    title: success ? '授权成功' : '授权已取消',
    icon: success ? 'success' : 'none'
  })
}

function handleLogout() {
  user.logout()
  uni.showToast({ title: '已退出授权', icon: 'none' })
}
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  padding-bottom: calc(122rpx + env(safe-area-inset-bottom));
  background: #f6f7f9;
}

.profile-hero {
  position: relative;
  min-height: 329rpx;
  padding: 84rpx 35rpx 42rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

.settings {
  position: absolute;
  top: 84rpx;
  right: 35rpx;
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 31rpx;
}

.user-row {
  display: flex;
  align-items: center;
  margin-top: 91rpx;
}

.avatar {
  width: 113rpx;
  height: 112rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.4);
  border-radius: 999rpx;
}

.user-main {
  min-width: 0;
  flex: 1;
  margin-left: 28rpx;
}

.name {
  display: block;
  color: #ffffff;
  font-size: 35rpx;
  font-weight: 800;
}

.level {
  display: inline-flex;
  margin-top: 7rpx;
  padding: 3rpx 14rpx;
  border-radius: 10rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 19rpx;
  font-weight: 400;
}

.auth-button {
  height: 56rpx;
  margin: 0;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #059669;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 56rpx;
}

.auth-button::after,
.primary-auth::after {
  border: 0;
}

.user-arrow {
  color: #ffffff;
  font-size: 36rpx;
}

.auth-card {
  display: flex;
  margin: -14rpx 35rpx 28rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
  flex-direction: column;
}

.auth-title {
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 40rpx;
}

.auth-desc {
  margin-top: 8rpx;
  color: #6b7280;
  font-size: 22rpx;
  line-height: 34rpx;
}

.primary-auth {
  height: 72rpx;
  margin: 24rpx 0 0;
  border-radius: 999rpx;
  background: #10b981;
  color: #ffffff;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 72rpx;
}

.stats-card,
.menu-card,
.logout {
  margin: 0 35rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}

.stats-card {
  display: flex;
  min-height: 154rpx;
  align-items: center;
  justify-content: space-around;
  padding: 28rpx;
  box-sizing: border-box;
}

.stat {
  display: flex;
  align-items: center;
  flex: 1;
  flex-direction: column;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.stat text:first-child {
  color: #10b981;
  font-size: 42rpx;
  font-weight: 800;
}

.stat.orange text:first-child {
  color: #f59e0b;
}

.divider {
  width: 3rpx;
  height: 98rpx;
  background: #f3f4f6;
}

.menu-card {
  margin-top: 28rpx;
  padding: 0;
  overflow: hidden;
}

.menu-item {
  display: flex;
  min-height: 112rpx;
  align-items: center;
  padding: 24rpx 28rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 500;
  box-sizing: border-box;
}

.menu-icon {
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  margin-right: 21rpx;
  border-radius: 21rpx;
  font-size: 31rpx;
}

.green { background: #d1fae5; color: #10b981; }
.yellow { background: #fef3c7; color: #f59e0b; }
.purple { background: #ede9fe; color: #8b5cf6; }
.blue { background: #dbeafe; color: #3b82f6; }
.pink { background: #ffe4e6; color: #ff3b6b; }
.gray { background: #f1f3f6; color: #7f8a9b; }

.menu-extra {
  flex: 1;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
  text-align: right;
}

.menu-extra.red {
  color: #ff3b6b;
}

.menu-item > .ri-arrow-right-s-line {
  margin-left: 7rpx;
  color: #9ca3af;
  font-size: 24rpx;
}

.menu-item > text:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.logout {
  height: 73rpx;
  margin-top: 42rpx;
  color: #ef4444;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 73rpx;
  text-align: center;
}
</style>
