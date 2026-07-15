<template>
  <view class="category-grid">
    <view
      v-for="item in items"
      :key="item.id"
      class="category-item"
      @tap="$emit('select', item.id)"
    >
      <view class="category-icon" :style="{ backgroundColor: item.color }">
        <text>{{ item.icon }}</text>
      </view>
      <text class="category-name">{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { SportCategory } from '@/types/domain'

defineProps<{
  items: SportCategory[]
}>()

defineEmits<{
  select: [id: number]
}>()
</script>

<style scoped lang="scss">
.category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14rpx;
  padding: 0 32rpx;
}

.category-item {
  display: flex;
  min-width: 0;
  align-items: center;
  flex-direction: column;
}

.category-icon {
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  color: #0f172a;
  font-size: 23rpx;
  font-weight: 900;
}

.category-name {
  width: 100%;
  margin-top: 14rpx;
  color: #3e4654;
  font-size: 24rpx;
  line-height: 1.2;
  text-align: center;
}
</style>
