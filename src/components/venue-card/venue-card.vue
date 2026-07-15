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
        <text class="meta-icon">⌖</text>
        <text>{{ venue.district }} · {{ venue.address }}</text>
        <text v-if="showDistance" class="distance">⌁ {{ venue.distance }}</text>
      </view>

      <view class="bottom-row">
        <view v-if="showAvailable" class="available">
          <text class="clock">◷</text>
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
  margin: 0 32rpx 24rpx;
}

.venue-cover {
  display: block;
  width: 100%;
  height: 192rpx;
  background: #dbe3ea;
}

.venue-body {
  padding: 22rpx 24rpx 24rpx;
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
  color: #121827;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 1.25;
}

.venue-score {
  gap: 6rpx;
  color: #111827;
  font-size: 26rpx;
  font-weight: 800;
}

.star {
  color: #f59e0b;
  font-size: 25rpx;
}

.tag-row {
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}

.tag {
  padding: 5rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 800;
  line-height: 1.2;
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
  gap: 8rpx;
  margin-top: 22rpx;
  color: #9aa3b2;
  font-size: 24rpx;
  font-weight: 600;
}

.distance {
  margin-left: 12rpx;
}

.bottom-row {
  margin-top: 24rpx;
}

.available {
  gap: 8rpx;
  color: #8b95a6;
  font-size: 24rpx;
  font-weight: 600;
}

.clock {
  font-size: 25rpx;
}

.price-wrap {
  align-items: baseline;
  margin-left: auto;
}

.price-main {
  color: #ff3b6b;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 1;
}

.price-unit {
  margin-left: 4rpx;
  color: #9aa3b2;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
