<template>
  <view class="submit-bar">
    <view class="submit-info">
      <slot name="info" />
    </view>
    <view class="primary-button submit-btn" @tap="$emit('submit')">
      <slot>立即预约</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
defineEmits<{
  submit: []
}>()
</script>

<style scoped lang="scss">
.submit-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 32rpx calc(18rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #edf0f4;
  background: #fff;
}

.submit-info {
  min-width: 0;
  flex: 1;
}

.submit-btn {
  width: 190rpx;
  min-height: 84rpx;
  margin-left: 24rpx;
}
</style>
