<template>
  <view class="slot-grid">
    <view
      v-for="item in items"
      :key="item.id"
      class="slot"
      :class="[`slot-${item.status}`, { active: item.id === modelValue }]"
      @tap="select(item)"
    >
      <text class="slot-time">{{ item.start }}-{{ item.end }}</text>
      <text class="slot-price">¥{{ item.price }}/时</text>
      <text class="slot-status">{{ statusText(item.status, item.id === modelValue) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { VenueSlot } from '@/types/domain'

defineProps<{
  items: VenueSlot[]
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function statusText(status: VenueSlot['status'], active: boolean) {
  if (status === 'soldOut') return '已约满'
  if (status === 'locked') return '锁定中'
  if (active || status === 'selected') return '已选择'
  return '可预约'
}

function select(item: VenueSlot) {
  if (item.status === 'soldOut' || item.status === 'locked') return
  emit('update:modelValue', item.id)
}
</script>

<style scoped lang="scss">
.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  padding: 0 35rpx;
}

.slot {
  display: flex;
  min-height: 148rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1rpx solid #bbf7d0;
  border-radius: 21rpx;
  background: #f0fff7;
  color: #059669;
}

.slot.active,
.slot-selected {
  border-color: #10b981;
  background: #10b981;
  color: #fff;
}

.slot-soldOut,
.slot-locked {
  border-color: #edf0f4;
  background: #f0f2f5;
  color: #a5adbb;
}

.slot-time {
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1.1;
}

.slot-price {
  margin-top: 4rpx;
  font-size: 21rpx;
  font-weight: 400;
  line-height: 1;
}

.slot-status {
  margin-top: 4rpx;
  font-size: 19rpx;
  font-weight: 400;
  line-height: 1;
}
</style>
