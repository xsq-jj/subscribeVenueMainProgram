<template>
  <view class="venue-card surface-card" @tap="$emit('open', venue.id)">
    <image class="venue-cover" mode="aspectFill" :src="venue.cover" />
    <view class="venue-body">
      <view class="venue-title-row">
        <text class="venue-title">{{ venue.name }}</text>
        <view class="venue-score">
          <text class="star">★</text>
          <text>{{ venue.score }}</text>
        </view>
      </view>

      <view class="tag-row">
        <text
          v-for="(tag, index) in venue.tags"
          :key="tag"
          class="tag"
          :class="`tag-${venue.tagTypes[index] || 'green'}`"
        >
          {{ tag }}
        </text>
      </view>

      <view class="meta-row">
        <text class="ri ri-map-pin-line"></text>
        <text>{{ venue.district }} · {{ venue.address }}</text>
        <text v-if="showDistance" class="distance">· {{ venue.distance }}</text>
      </view>

      <view class="bottom-row">
        <view v-if="showAvailable" class="available">
          <text class="ri ri-time-line"></text>
          <text>{{ venue.todayAvailableText }}</text>
        </view>
        <view class="price-wrap">
          <text class="price-main">¥{{ venue.minPrice }}</text>
          <text class="price-unit">/小时起</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Venue } from '@/types/domain'

withDefaults(
  defineProps<{
    venue: Venue
    showDistance?: boolean
    showAvailable?: boolean
  }>(),
  {
    showDistance: false,
    showAvailable: false
  }
)

defineEmits<{
  open: [id: number]
}>()
</script>

<style scoped lang="scss">
.venue-card {
  margin: 0 35rpx 21rpx;
  border-radius: 28rpx;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
}

.venue-cover {
  display: block;
  width: 100%;
  height: 307rpx;
  background: #dbe3ea;
}

.venue-body {
  padding: 28rpx;
}

.venue-title-row,
.bottom-row,
.venue-score,
.meta-row,
.tag-row,
.available,
.price-wrap {
  display: flex;
  align-items: center;
}

.venue-title-row,
.bottom-row {
  justify-content: space-between;
}

.venue-title {
  max-width: 440rpx;
  color: #1a1a2e;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.25;
}

.venue-score {
  gap: 7rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 600;
}

.star {
  color: #f59e0b;
  font-size: 24rpx;
}

.tag-row {
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 10rpx;
}

.tag {
  height: 37rpx;
  padding: 0 14rpx;
  border-radius: 10rpx;
  font-size: 19rpx;
  font-weight: 500;
  line-height: 37rpx;
}

.tag-green {
  background: #e8fff4;
  color: #10b981;
}

.tag-blue {
  background: #eef6ff;
  color: #3b82f6;
}

.tag-orange {
  background: #fff1df;
  color: #f97316;
}

.tag-purple {
  background: #f2e8ff;
  color: #8b5cf6;
}

.meta-row {
  gap: 7rpx;
  margin-top: 14rpx;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.distance {
  margin-left: 21rpx;
}

.bottom-row {
  margin-top: 21rpx;
  padding-top: 21rpx;
}

.available {
  gap: 7rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 400;
}

.price-wrap {
  align-items: baseline;
  margin-left: auto;
}

.price-main {
  color: #ff3b6b;
  font-size: 35rpx;
  font-weight: 800;
  line-height: 1;
}

.price-unit {
  margin-left: 3rpx;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}
</style>
