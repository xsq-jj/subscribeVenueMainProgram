<template>
  <view class="page-shell favorite-page">
    <app-nav-bar title="我的收藏" show-back :right-text="store.favoriteEditMode ? '完成' : '编辑'" @right="store.toggleFavoriteEditMode()" />

    <view class="total-line">共收藏 <text>{{ store.favoriteTotal }}</text> 个场馆</view>

    <scroll-view scroll-x class="chip-scroll" :show-scrollbar="false">
      <view class="chip-row">
        <view
          v-for="item in store.categories"
          :key="item.id"
          class="chip"
          :class="{ active: store.favoriteCategoryId === item.id }"
          @tap="store.setFavoriteCategory(item.id)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>

    <view class="favorite-list">
      <view v-if="store.loadingFavorites" class="state-box">收藏加载中...</view>
      <view v-else-if="store.favoriteError && store.favoriteList.length === 0" class="state-box">
        <text>{{ store.favoriteError }}</text>
        <view class="retry-btn" @tap="store.loadFavorites()">重试</view>
      </view>
      <template v-else>
      <view v-if="store.favoriteError" class="warn-line">{{ store.favoriteError }}</view>
      <view v-for="venue in store.favoriteList" :key="venue.id" class="favorite-card" @tap="openVenue(venue.id)">
        <image class="cover" :src="venue.cover" mode="aspectFill" />
        <view class="main">
          <view class="title-row">
            <text class="name">{{ venue.name }}</text>
            <text class="ri ri-heart-fill heart" @tap.stop="store.toggleFavorite(venue.id)"></text>
          </view>
          <view class="score"><text class="star">★</text><text>{{ venue.score }}</text><text>（{{ venue.reviewCount }}条）</text></view>
          <text class="meta">{{ venue.district }} · {{ venue.address }} · {{ venue.distance }}</text>
          <view class="bottom">
            <view class="tags">
              <text v-for="tag in venue.tags.slice(0, 2)" :key="tag">{{ tag }}</text>
            </view>
            <view class="price"><text>¥{{ venue.minPrice }}</text><text>/时起</text></view>
          </view>
        </view>
      </view>
      <view v-if="store.favoriteList.length === 0" class="empty">暂无收藏场馆</view>
      <view v-else-if="store.favoriteList.length < store.favoriteCategoryTotal" class="load-more" @tap="store.loadMoreFavorites()">加载更多 <text class="ri ri-arrow-down-s-line"></text></view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import { venueDetailRoute } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { navigateTo } from '@/utils/router'

const store = useBookingStore()

onShow(() => {
  void store.loadFavorites()
})

function openVenue(id: number) {
  store.selectVenue(id)
  navigateTo(venueDetailRoute(id))
}
</script>

<style scoped lang="scss">
.favorite-page {
  min-height: 100vh;
  background: #f6f7f9;
}

.total-line {
  padding: 0 35rpx 21rpx;
  background: #ffffff;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
}

.total-line text {
  color: #10b981;
  font-weight: 900;
}

.chip-scroll {
  background: #ffffff;
  white-space: nowrap;
}

.chip-row {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 35rpx 21rpx;
}

.chip {
  min-width: 47rpx;
  height: 52rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 500;
  line-height: 52rpx;
  text-align: center;
}

.chip.active {
  background: #10b981;
  color: #ffffff;
}

.favorite-list {
  padding: 28rpx 35rpx;
  border-top: 1rpx solid #f3f4f6;
}

.favorite-card {
  display: flex;
  min-height: 225rpx;
  margin-bottom: 21rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 3rpx 21rpx rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.cover {
  width: 176rpx;
  height: 176rpx;
  flex: 0 0 176rpx;
  border-radius: 21rpx;
}

.main {
  min-width: 0;
  flex: 1;
  margin-left: 23rpx;
}

.title-row,
.score,
.bottom,
.tags,
.price {
  display: flex;
  align-items: center;
}

.title-row,
.bottom {
  justify-content: space-between;
}

.name {
  overflow: hidden;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.heart {
  color: #ff3b6b;
  font-size: 31rpx;
}

.score,
.meta {
  margin-top: 7rpx;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.star {
  margin-right: 6rpx;
  color: #f59e0b;
}

.meta {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bottom {
  margin-top: 10rpx;
}

.tags {
  gap: 9rpx;
}

.tags text {
  padding: 3rpx 14rpx;
  border-radius: 10rpx;
  background: #d1fae5;
  color: #059669;
  font-size: 19rpx;
  font-weight: 500;
}

.price {
  align-items: baseline;
  color: #9ca3af;
  font-size: 19rpx;
  font-weight: 400;
}

.price text:first-child {
  color: #ff3b6b;
  font-size: 31rpx;
  font-weight: 800;
}

.load-more,
.empty {
  padding: 7rpx 0 42rpx;
  color: #9ca3af;
  font-size: 23rpx;
  font-weight: 400;
  text-align: center;
}

.state-box {
  padding: 80rpx 0;
  color: #9aa3b2;
  font-size: 26rpx;
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

.warn-line {
  margin-bottom: 21rpx;
  padding: 18rpx 22rpx;
  border-radius: 18rpx;
  background: #fffbeb;
  color: #b45309;
  font-size: 22rpx;
}
</style>
