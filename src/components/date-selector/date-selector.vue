<template>
  <scroll-view class="date-scroll" scroll-x :show-scrollbar="false">
    <view class="date-list">
      <view
        v-for="item in items"
        :key="item.value"
        class="date-item"
        :class="{ active: item.value === modelValue }"
        @tap="$emit('update:modelValue', item.value)"
      >
        <text class="week">{{ item.week }}</text>
        <text class="day">{{ item.day }}</text>
        <text class="label">{{ item.label || ' ' }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import type { VenueDate } from '@/types/domain'

defineProps<{
  items: VenueDate[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped lang="scss">
.date-scroll {
  width: 100%;
  white-space: nowrap;
}

.date-list {
  display: inline-flex;
  gap: 14rpx;
  padding: 0 32rpx;
}

.date-item {
  display: flex;
  width: 86rpx;
  height: 104rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 16rpx;
  background: #f4f6f8;
  color: #8b95a6;
}

.date-item.active {
  background: #10b981;
  color: #fff;
}

.week {
  font-size: 21rpx;
  font-weight: 700;
}

.day {
  margin-top: 8rpx;
  font-size: 34rpx;
  font-weight: 900;
  line-height: 1;
}

.label {
  margin-top: 8rpx;
  font-size: 19rpx;
  font-weight: 800;
}
</style>
