<template>
  <view class="page-shell review-page">
    <view class="nav">
      <text class="ri ri-arrow-left-s-line back" @tap="back"></text>
      <text class="title">全部评论</text>
      <view class="score">
        <text class="ri ri-star-fill star"></text>
        <text>4.8</text>
        <text class="muted">({{ store.reviewSummary.total }})</text>
      </view>
    </view>

    <view class="summary-section">
      <view class="rating-list">
        <view v-for="item in ratingBars" :key="item.label" class="rating-row">
          <text class="rating-label">{{ item.label }}</text>
          <view class="bar-track">
            <view class="bar" :class="{ muted: item.muted }" :style="{ width: item.width + '%' }" />
          </view>
          <text class="rating-count">{{ item.count }}</text>
        </view>
      </view>
    </view>

    <view class="tabs-wrap">
      <view class="tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: store.reviewFilter === tab.value }"
          @tap="store.setReviewFilter(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>
    </view>

    <view class="review-list">
      <view v-for="review in store.filteredReviews" :key="review.id" class="review-card">
        <view class="review-head">
          <image class="avatar" :src="review.avatar" mode="aspectFill" />
          <view class="review-user">
            <text class="user-name">{{ review.userName }}</text>
            <view class="star-row">
              <text
                v-for="index in 5"
                :key="index"
                :class="['ri', index <= review.rating ? 'ri-star-fill' : 'ri-star-line', 'stars']"
              ></text>
              <text class="time">{{ review.timeText }}</text>
            </view>
          </view>
        </view>
        <text class="content">{{ review.content }}</text>
        <view v-if="review.images.length" class="image-row">
          <image
            v-for="image in review.images.slice(0, 3)"
            :key="image"
            class="review-image"
            :src="image"
            mode="aspectFill"
          />
        </view>
        <view class="action-row">
          <view
            class="action"
            :class="{ active: store.likedReviewIds.includes(review.id) }"
            @tap="store.toggleReviewLike(review.id)"
          >
            <text class="ri ri-thumb-up-line"></text>
            <text>{{ likeCount(review.id, review.likeCount) }}</text>
          </view>
          <view class="action">
            <text class="ri ri-chat-1-line"></text>
            <text>{{ review.commentCount }}</text>
          </view>
        </view>
        <view v-if="review.merchantReply" class="reply">
          <text>商家回复：</text>{{ review.merchantReply }}
        </view>
      </view>
    </view>

    <view
      v-if="store.filteredReviews.length < store.reviewFilteredTotal"
      class="load-more"
      @tap="store.loadMoreReviews()"
    >
      加载更多评论
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const tabs = computed<Array<{ label: string; value: 'ALL' | 'GOOD' | 'IMAGE' | 'LATEST' }>>(() => [
  { label: `全部 ${store.reviewSummary.total}`, value: 'ALL' },
  { label: `好评 ${store.reviewSummary.good}`, value: 'GOOD' },
  { label: `有图 ${store.reviewSummary.withImage}`, value: 'IMAGE' },
  { label: '最新', value: 'LATEST' }
])

const ratingBars = [
  { label: '5星', width: 72, count: 206, muted: false },
  { label: '4星', width: 18, count: 52, muted: false },
  { label: '3星', width: 6, count: 17, muted: true },
  { label: '2星', width: 2, count: 6, muted: true },
  { label: '1星', width: 1, count: 5, muted: true }
]

function back() {
  uni.navigateBack()
}

function likeCount(id: number, count: number) {
  return store.likedReviewIds.includes(id) ? count + 1 : count
}
</script>

<style scoped lang="scss">
.review-page {
  min-height: 100vh;
  box-sizing: border-box;
  background: #f9fafb;
}

.nav,
.score,
.rating-row,
.tabs,
.review-head,
.star-row,
.image-row,
.action-row,
.action {
  display: flex;
  align-items: center;
}

.nav {
  height: 90px;
  padding: 48px 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.back {
  width: 22px;
  margin-right: 13px;
  color: #111827;
  font-size: 30px;
  line-height: 1;
}

.title {
  flex: 1;
  color: #1a1a2e;
  font-size: 17px;
  font-weight: 700;
  line-height: 26px;
}

.score {
  width: 82px;
  justify-content: flex-end;
  gap: 5px;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

.star,
.stars {
  color: #f59e0b;
}

.stars.ri-star-line {
  color: #d1d5db;
}

.muted,
.time {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 400;
}

.summary-section {
  padding: 0 20px 16px;
  box-sizing: border-box;
  background: #ffffff;
}

.rating-list {
  width: 390px;
  height: 144px;
}

.rating-row {
  width: 390px;
  height: 24px;
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 12px;
}

.rating-row:last-child {
  margin-bottom: 0;
}

.rating-label {
  width: 38px;
}

.bar-track {
  overflow: hidden;
  width: 312px;
  height: 6px;
  margin: 0 10px;
  border-radius: 999px;
  background: #edf0f4;
}

.bar {
  height: 6px;
  border-radius: 999px;
  background: #10b981;
}

.bar.muted {
  background: #d1d5db;
}

.rating-count {
  width: 30px;
  text-align: right;
}

.tabs-wrap {
  padding: 0 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.tabs {
  width: 390px;
  height: 30px;
  gap: 9px;
}

.tab {
  height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  line-height: 30px;
}

.tab.active {
  background: #10b981;
  color: #ffffff;
}

.review-list {
  padding: 16px 20px 0;
  border-top: 1px solid #f3f4f6;
  box-sizing: border-box;
  background: #ffffff;
}

.review-card {
  width: 390px;
  padding: 0 0 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #edf0f4;
}

.review-head {
  width: 390px;
  height: 40px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #e5e7eb;
}

.review-user {
  min-width: 0;
  flex: 1;
  margin-left: 13px;
}

.user-name {
  display: block;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

.star-row {
  height: 18px;
}

.stars {
  font-size: 12px;
}

.time {
  margin-left: 9px;
}

.content {
  display: block;
  margin-top: 10px;
  color: #374151;
  font-size: 14px;
  line-height: 22px;
}

.image-row {
  gap: 9px;
  margin-top: 10px;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background: #e5e7eb;
}

.action-row {
  height: 21px;
  gap: 25px;
  margin-top: 10px;
}

.action {
  gap: 5px;
  color: #9ca3af;
  font-size: 12px;
}

.action .ri {
  font-size: 14px;
}

.action.active {
  color: #10b981;
  font-weight: 700;
}

.reply {
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
  line-height: 20px;
}

.reply text {
  color: #10b981;
  font-weight: 700;
}

.load-more {
  height: 56px;
  background: #ffffff;
  color: #9ca3af;
  font-size: 13px;
  line-height: 56px;
  text-align: center;
}
</style>
