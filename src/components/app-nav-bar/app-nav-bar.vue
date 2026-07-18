<template>
  <view class="app-nav" :class="{ plain }">
    <view v-if="showBack" class="nav-action" @tap="handleBack">
      <view class="back-chevron"></view>
    </view>
    <view v-else-if="leftText" class="nav-location" @tap="$emit('left')">
      <text class="ri ri-map-pin-line"></text>
      <text>{{ leftText }}</text>
      <text class="ri ri-arrow-down-s-line nav-down"></text>
    </view>
    <view v-else class="nav-action placeholder"></view>

    <text class="nav-title">{{ title }}</text>

    <view class="nav-right">
      <slot name="right">
        <view v-if="rightText || rightIcon" class="nav-right-inner" @tap="$emit('right')">
          <text v-if="rightIcon" :class="['ri', rightIcon]"></text>
          <text v-if="rightText">{{ rightText }}</text>
        </view>
        <view v-else class="nav-action placeholder"></view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { goBack } from '@/utils/router'

const props = withDefaults(
  defineProps<{
    title?: string
    showBack?: boolean
    leftText?: string
    rightText?: string
    rightIcon?: string
    fallbackUrl?: string
    plain?: boolean
  }>(),
  {
    title: '',
    showBack: false,
    leftText: '',
    rightText: '',
    rightIcon: '',
    fallbackUrl: '',
    plain: false
  }
)

const emit = defineEmits<{
  back: []
  left: []
  right: []
}>()

function handleBack() {
  emit('back')
  goBack(props.fallbackUrl || undefined)
}
</script>

<style scoped lang="scss">
.app-nav {
  display: flex;
  height: 45rpx;
  align-items: center;
  padding: 84rpx 35rpx 21rpx;
  box-sizing: content-box;
  background: #ffffff;
}

.app-nav.plain {
  background: transparent;
}

.nav-action {
  display: flex;
  width: 38rpx;
  height: 45rpx;
  align-items: center;
  justify-content: center;
  color: #111827;
  font-size: 35rpx;
}

.placeholder {
  visibility: hidden;
}

.back-chevron {
  width: 18rpx;
  height: 18rpx;
  border-bottom: 4rpx solid currentColor;
  border-left: 4rpx solid currentColor;
  transform: rotate(45deg);
}

.nav-location {
  display: flex;
  min-width: 0;
  max-width: 279rpx;
  height: 45rpx;
  align-items: center;
  gap: 7rpx;
  color: #111827;
  font-size: 28rpx;
  font-weight: 700;
}

.nav-location .ri-map-pin-line {
  color: #22c55e;
  font-size: 35rpx;
}

.nav-down {
  color: #9aa3b2;
  font-size: 28rpx;
}

.nav-title {
  min-width: 0;
  flex: 1;
  color: #1a1a2e;
  font-size: 30rpx;
  font-weight: 800;
  text-align: center;
}

.nav-right {
  display: flex;
  min-width: 38rpx;
  justify-content: flex-end;
}

.nav-right-inner {
  display: flex;
  min-width: 0;
  height: 35rpx;
  align-items: center;
  justify-content: flex-end;
  gap: 9rpx;
  color: #9ca3af;
  font-size: 23rpx;
  font-weight: 400;
}

.nav-right-inner .ri {
  font-size: 31rpx;
}
</style>
