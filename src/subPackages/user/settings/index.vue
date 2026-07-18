<template>
  <view class="page-shell settings-page">
    <view class="settings-nav">
      <view class="nav-action" @tap="goBack(ROUTES.TAB_PROFILE)">
        <text class="ri ri-arrow-left-s-line"></text>
      </view>
      <text class="nav-title">设置</text>
      <view class="nav-action placeholder"></view>
    </view>

    <view class="setting-section">
      <text class="group-title">账号安全</text>
      <view class="setting-card">
        <view class="setting-row" @tap="showTodo('手机号绑定')">
          <view class="row-left">
            <view class="row-icon blue"><text class="ri ri-smartphone-line"></text></view>
            <text>绑定手机</text>
          </view>
          <view class="row-right">
            <text>138****8888</text>
            <text class="ri ri-arrow-right-s-line"></text>
          </view>
        </view>
        <view class="setting-row" @tap="showTodo('微信绑定')">
          <view class="row-left">
            <view class="row-icon green"><text class="ri ri-wechat-line"></text></view>
            <text>绑定微信</text>
          </view>
          <view class="row-right orange">
            <text>未绑定</text>
            <text class="ri ri-arrow-right-s-line"></text>
          </view>
        </view>
        <view class="setting-row danger-row" @tap="confirmDeactivate">
          <view class="row-left">
            <view class="row-icon red"><text class="ri ri-delete-bin-line"></text></view>
            <text>账号注销</text>
          </view>
          <view class="row-right">
            <text class="ri ri-arrow-right-s-line"></text>
          </view>
        </view>
      </view>
    </view>

    <view class="setting-section notification-section">
      <text class="group-title">消息通知</text>
      <view class="setting-card">
        <view class="setting-row" @tap="pushEnabled = !pushEnabled">
          <view class="row-left">
            <view class="row-icon yellow"><text class="ri ri-notification-4-line"></text></view>
            <text>推送通知</text>
          </view>
          <view class="toggle-switch" :class="{ on: pushEnabled }">
            <view class="toggle-dot"></view>
          </view>
        </view>
        <view class="setting-row" @tap="smsEnabled = !smsEnabled">
          <view class="row-left">
            <view class="row-icon purple"><text class="ri ri-message-2-line"></text></view>
            <text>短信通知</text>
          </view>
          <view class="toggle-switch" :class="{ on: smsEnabled }">
            <view class="toggle-dot"></view>
          </view>
        </view>
        <view class="setting-row" @tap="showTodo('免打扰时段')">
          <view class="row-left">
            <view class="row-icon gray"><text class="ri ri-moon-line"></text></view>
            <text>免打扰时段</text>
          </view>
          <view class="row-right">
            <text>23:00-07:00</text>
            <text class="ri ri-arrow-right-s-line"></text>
          </view>
        </view>
      </view>
    </view>

    <view class="logout-button" @tap="confirmLogout">退出登录</view>

    <bottom-tabbar active="profile" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomTabbar from '@/components/bottom-tabbar/bottom-tabbar.vue'
import { ROUTES } from '@/config/routes'
import { useUserStore } from '@/stores/user'
import { goBack } from '@/utils/router'

const user = useUserStore()
const pushEnabled = ref(true)
const smsEnabled = ref(true)

function showTodo(name: string) {
  uni.showToast({ title: `${name}功能建设中`, icon: 'none' })
}

function confirmDeactivate() {
  uni.showModal({
    title: '账号注销',
    content: '账号注销后将清除本地授权状态，当前后端暂未接入，仅做交互提示。',
    confirmText: '我知道了',
    showCancel: false
  })
}

function confirmLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确认退出当前授权状态吗？',
    confirmText: '退出',
    confirmColor: '#ff3b6b',
    success: result => {
      if (!result.confirm) return

      user.logout()
      uni.showToast({ title: '已退出登录', icon: 'none' })
    }
  })
}
</script>

<style scoped lang="scss">
.settings-page {
  min-height: 100vh;
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
  background: #f4f6f8;
  box-sizing: border-box;
}

.settings-nav {
  position: relative;
  display: flex;
  height: 175rpx;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 35rpx 31rpx;
  box-sizing: border-box;
  background: #006440;
}

.nav-action {
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 35rpx;
}

.placeholder {
  visibility: hidden;
}

.nav-title {
  position: absolute;
  right: 110rpx;
  bottom: 43rpx;
  left: 110rpx;
  color: #ffffff;
  font-size: 35rpx;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.setting-section {
  margin-top: 28rpx;
  padding: 0 35rpx;
}

.notification-section {
  margin-top: 21rpx;
}

.group-title {
  display: block;
  margin: 0 0 14rpx 7rpx;
  color: #9ca3af;
  font-size: 23rpx;
  font-weight: 700;
}

.setting-card {
  overflow: hidden;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 9rpx 30rpx rgba(15, 23, 42, 0.06);
}

.setting-row {
  position: relative;
  display: flex;
  min-height: 112rpx;
  align-items: center;
  justify-content: space-between;
  padding: 0 28rpx;
  box-sizing: border-box;
}

.setting-row + .setting-row::before {
  position: absolute;
  top: 0;
  right: 28rpx;
  left: 91rpx;
  height: 1rpx;
  background: #edf0f4;
  content: '';
}

.row-left,
.row-right {
  display: flex;
  align-items: center;
}

.row-left {
  min-width: 0;
  color: #1f2937;
  font-size: 28rpx;
  font-weight: 700;
}

.row-icon {
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  border-radius: 18rpx;
  font-size: 31rpx;
}

.blue { background: #dbeafe; color: #3b82f6; }
.green { background: #d1fae5; color: #10b981; }
.red { background: #ffe4e6; color: #ff3b6b; }
.yellow { background: #fef3c7; color: #f59e0b; }
.purple { background: #e0e7ff; color: #6366f1; }
.gray { background: #f1f3f6; color: #6b7280; }

.row-right {
  gap: 9rpx;
  color: #8b95a6;
  font-size: 23rpx;
  font-weight: 500;
}

.row-right.orange {
  color: #f97316;
}

.row-right .ri {
  color: #a7afbd;
  font-size: 28rpx;
}

.toggle-switch {
  display: flex;
  width: 84rpx;
  height: 49rpx;
  align-items: center;
  padding: 3rpx;
  border-radius: 999rpx;
  background: #d1d5db;
  box-sizing: border-box;
  transition: background 160ms ease;
}

.toggle-switch.on {
  justify-content: flex-end;
  background: #10b981;
}

.toggle-dot {
  width: 42rpx;
  height: 42rpx;
  border-radius: 999rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(15, 23, 42, 0.18);
}

.logout-button {
  height: 77rpx;
  margin: 42rpx 35rpx 0;
  border-radius: 28rpx;
  background: #ffffff;
  color: #ff3b6b;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 77rpx;
  text-align: center;
  box-shadow: 0 9rpx 30rpx rgba(15, 23, 42, 0.05);
}
</style>
