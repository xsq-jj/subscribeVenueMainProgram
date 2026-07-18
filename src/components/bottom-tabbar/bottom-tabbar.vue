<template>
  <view class="tabbar">
    <view class="tabbar-inner">
      <view
        v-for="item in items"
        :key="item.key"
        class="tabbar-item"
        :class="{ active: active === item.key }"
        @tap="open(item)"
      >
        <text :class="['ri', active === item.key ? item.activeIcon : item.icon]"></text>
        <text class="tabbar-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ROUTES } from '@/config/routes'
import { goTab } from '@/utils/router'

type TabKey = 'home' | 'venue' | 'order' | 'profile'

type TabItem = {
  key: TabKey
  label: string
  icon: string
  activeIcon: string
  url: string
}

const props = defineProps<{
  active: TabKey
}>()

const items: TabItem[] = [
  { key: 'home', label: '首页', icon: 'ri-home-4-line', activeIcon: 'ri-home-4-line', url: ROUTES.TAB_HOME },
  { key: 'venue', label: '场地', icon: 'ri-building-line', activeIcon: 'ri-building-line', url: ROUTES.TAB_VENUE },
  { key: 'order', label: '订单', icon: 'ri-file-list-3-line', activeIcon: 'ri-file-list-3-fill', url: ROUTES.TAB_ORDER },
  { key: 'profile', label: '我的', icon: 'ri-user-line', activeIcon: 'ri-user-line', url: ROUTES.TAB_PROFILE }
]

function open(item: TabItem) {
  if (props.active === item.key) {
    return
  }

  goTab(item.url)
}
</script>

<style scoped lang="scss">
.tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  display: flex;
  max-width: 430px;
  height: calc(110rpx + env(safe-area-inset-bottom));
  margin: 0 auto;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 14rpx;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1rpx solid #edf0f4;
  background: rgba(255, 255, 255, 0.98);
}

.tabbar-inner {
  display: flex;
  width: 666rpx;
  height: 82rpx;
  align-items: center;
  justify-content: space-between;
}

.tabbar-item {
  display: flex;
  width: 40rpx;
  height: 82rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #9aa3b2;
  font-size: 19rpx;
  font-weight: 500;
  transition: color 160ms ease, transform 160ms ease;
}

.tabbar-item:active {
  transform: scale(0.96);
}

.tabbar-item .ri {
  margin-bottom: 4rpx;
  font-size: 38rpx;
}

.tabbar-label {
  height: 30rpx;
  line-height: 30rpx;
  white-space: nowrap;
}

.tabbar-item.active {
  color: #10b981;
}
</style>
