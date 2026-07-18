<template>
  <view class="page-shell review-page">
    <app-nav-bar title="全部评论" show-back>
      <template #right>
        <view class="rating-top">
          <text class="star">★</text>
          <text>{{ store.reviewSummary.rating || 5 }}</text>
          <text>({{ store.reviewSummary.total }})</text>
        </view>
      </template>
    </app-nav-bar>

    <view class="summary">
      <view v-for="item in ratingBars" :key="item.label" class="rating-row">
        <text>{{ item.label }}</text>
        <view class="rating-track"><view class="rating-fill" :style="{ width: item.width }"></view></view>
        <text>{{ item.count }}</text>
      </view>
    </view>

    <view class="filters">
      <view
        v-for="item in filters"
        :key="item.value"
        class="filter"
        :class="{ active: store.reviewFilter === item.value }"
        @tap="store.setReviewFilter(item.value)"
      >
        {{ item.label }}
      </view>
    </view>

    <view class="review-list">
      <view v-if="store.loadingReviews" class="state-box">评论加载中...</view>
      <view v-else-if="store.reviewError && store.reviews.length === 0" class="state-box">
        <text>{{ store.reviewError }}</text>
        <view class="retry-btn" @tap="store.loadReviews(store.venueId, true)">重试</view>
      </view>
      <template v-else>
      <view v-for="review in store.filteredReviews" :key="review.id" class="review-item">
        <view class="review-header">
          <image class="avatar" :src="review.avatar" mode="aspectFill" />
          <view class="review-user">
            <text class="name">{{ review.userName }}</text>
            <view class="meta-row">
              <text class="stars">{{ stars(review.rating) }}</text>
              <text class="time">{{ review.timeText }}</text>
            </view>
          </view>
        </view>
        <text class="content">{{ review.content }}</text>
        <view v-if="review.images.length" class="images">
          <image v-for="image in review.images" :key="image" :src="image" mode="aspectFill" />
        </view>
        <view class="review-actions">
          <view @tap="store.toggleReviewLike(review.id)">
            <text :class="['ri', review.liked || store.likedReviewIds.includes(review.id) ? 'ri-heart-fill' : 'ri-thumb-up-line']"></text>
            <text>{{ review.likeCount }}</text>
          </view>
          <view><text class="ri ri-chat-1-line"></text><text>{{ review.commentCount }}</text></view>
        </view>
        <view v-if="review.merchantReply" class="reply">
          <text>商家回复：</text>
          <text>{{ review.merchantReply }}</text>
        </view>
      </view>
      <view
        v-if="store.reviewHasMore || store.reviewVisibleCount < store.reviewFilteredTotal"
        class="load-more"
        @tap="store.loadMoreReviews()"
      >
        加载更多评论 <text class="ri ri-arrow-down-s-line"></text>
      </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()

onLoad(query => {
  const venueId = Number(query.venueId || store.venueId || 1)
  if (!Number.isNaN(venueId)) {
    store.selectVenue(venueId)
    void store.loadReviews(venueId)
    void store.loadReviewSummary(venueId)
  }
})

const ratingBars = computed(() => {
  const total = Math.max(store.reviewSummary.total, 1)
  const starCounts = store.reviewSummary.starCounts || {}
  const rows = [
    { label: '5星', count: Number(starCounts[5] || 0) },
    { label: '4星', count: Number(starCounts[4] || 0) },
    { label: '3星', count: Number(starCounts[3] || 0) },
    { label: '2星', count: Number(starCounts[2] || 0) },
    { label: '1星', count: Number(starCounts[1] || 0) }
  ]

  return rows.map(item => ({
    ...item,
    width: `${Math.round((item.count / total) * 100)}%`
  }))
})

const filters = computed<Array<{ label: string; value: 'ALL' | 'GOOD' | 'IMAGE' | 'LATEST' }>>(() => [
  { label: `全部 ${store.reviewSummary.total}`, value: 'ALL' },
  { label: `好评 ${store.reviewSummary.good}`, value: 'GOOD' },
  { label: `有图 ${store.reviewSummary.withImage}`, value: 'IMAGE' },
  { label: '最新', value: 'LATEST' }
])

function stars(rating: number) {
  return '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating)
}
</script>

<style scoped lang="scss">
.review-page {
  min-height: 100vh;
  background: #f9fafb;
}

.rating-top {
  display: flex;
  align-items: center;
  gap: 7rpx;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 900;
}

.star,
.stars {
  color: #f59e0b;
}

.rating-top text:last-child {
  color: #9ca3af;
  font-size: 21rpx;
}

.summary {
  padding: 0 35rpx 28rpx;
  background: #ffffff;
}

.rating-row {
  display: flex;
  height: 42rpx;
  align-items: center;
  gap: 17rpx;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 500;
}

.rating-row text:first-child {
  width: 49rpx;
}

.rating-row text:last-child {
  width: 49rpx;
  text-align: right;
}

.rating-track {
  height: 10rpx;
  flex: 1;
  overflow: hidden;
  border-radius: 999rpx;
  background: #f3f4f6;
}

.rating-fill {
  height: 100%;
  border-radius: 999rpx;
  background: #10b981;
}

.filters {
  display: flex;
  gap: 14rpx;
  padding: 0 35rpx 21rpx;
  border-bottom: 1rpx solid #f3f4f6;
  background: #ffffff;
}

.filter {
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 21rpx;
  font-weight: 600;
  line-height: 52rpx;
}

.filter.active {
  background: #10b981;
  color: #ffffff;
}

.review-list {
  padding: 28rpx 35rpx 42rpx;
  background: #ffffff;
}

.review-item {
  padding-bottom: 21rpx;
  margin-bottom: 21rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.review-header {
  display: flex;
  align-items: center;
}

.avatar {
  width: 65rpx;
  height: 63rpx;
  flex: 0 0 65rpx;
  border-radius: 999rpx;
}

.review-user {
  min-width: 0;
  flex: 1;
  margin-left: 14rpx;
}

.name {
  display: block;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 700;
}

.meta-row,
.review-actions,
.review-actions view {
  display: flex;
  align-items: center;
}

.meta-row {
  gap: 14rpx;
  margin-top: 2rpx;
}

.time {
  color: #9ca3af;
  font-size: 21rpx;
}

.content {
  display: block;
  margin-top: 18rpx;
  color: #4b5563;
  font-size: 24rpx;
  line-height: 1.55;
}

.images {
  display: flex;
  gap: 14rpx;
  margin-top: 18rpx;
}

.images image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 18rpx;
}

.review-actions {
  gap: 28rpx;
  justify-content: flex-end;
  margin-top: 18rpx;
  color: #9ca3af;
  font-size: 22rpx;
}

.review-actions view {
  gap: 8rpx;
}

.review-actions .ri-heart-fill {
  color: #ff3b6b;
}

.reply {
  margin-top: 18rpx;
  padding: 18rpx;
  border-radius: 18rpx;
  background: #f8fafc;
  color: #6b7280;
  font-size: 22rpx;
  line-height: 1.5;
}

.reply text:first-child {
  color: #111827;
  font-weight: 800;
}

.load-more {
  padding: 20rpx 0 8rpx;
  color: #9ca3af;
  font-size: 23rpx;
  text-align: center;
}

.state-box {
  padding: 70rpx 0;
  color: #9ca3af;
  font-size: 24rpx;
  text-align: center;
}

.retry-btn {
  width: fit-content;
  margin: 22rpx auto 0;
  padding: 14rpx 34rpx;
  border-radius: 999rpx;
  background: #10b981;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
