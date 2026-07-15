<template>
  <view class="page-shell favorite-page">
    <view class="nav">
      <text class="ri ri-arrow-left-s-line back" @tap="back"></text>
      <text class="title">我的收藏</text>
      <text class="edit" @tap="store.toggleFavoriteEditMode()">
        {{ store.favoriteEditMode ? '完成' : '编辑' }}
      </text>
    </view>

    <view class="count-line">
      共收藏 <text>{{ store.favoriteTotal }}</text> 个场馆
    </view>

    <scroll-view scroll-x class="filter-bar" :show-scrollbar="false">
      <view class="filter-inner">
        <view
          v-for="item in tabs"
          :key="item.id"
          class="filter-chip"
          :class="{ active: store.favoriteCategoryId === item.id }"
          @tap="store.setFavoriteCategory(item.id)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>

    <view class="favorite-list">
      <view
        v-for="venue in store.favoriteList"
        :key="venue.id"
        class="favorite-card"
        @tap="openVenue(venue.id)"
      >
        <image class="cover" :src="venue.cover" mode="aspectFill" />
        <view class="info">
          <view class="title-row">
            <text class="venue-name">{{ venue.name }}</text>
            <text
              :class="[
                'ri',
                store.favoriteVenueIds.includes(venue.id) ? 'ri-heart-fill' : 'ri-heart-line',
                'heart'
              ]"
              @tap.stop="store.toggleFavorite(venue.id)"
            ></text>
          </view>
          <view class="score-line">
            <text class="ri ri-star-fill star"></text>
            <text>{{ venue.score }}（{{ venue.reviewCount }}条）</text>
          </view>
          <view class="meta-line">
            <text>{{ venue.district }} · {{ venue.address }}</text>
            <text>{{ venue.distance }}</text>
          </view>
          <view class="bottom-row">
            <view class="tag-row">
              <text
                v-for="(tag, index) in venue.tags.slice(0, 2)"
                :key="tag"
                class="tag"
                :class="venue.tagTypes[index]"
              >
                {{ tag }}
              </text>
            </view>
            <view class="price-wrap">
              <text class="price">¥{{ venue.minPrice }}</text>
              <text class="unit">/时起</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="store.favoriteList.length === 0" class="empty">
      当前分类暂无收藏场馆
    </view>

    <view
      v-if="store.favoriteList.length < store.favoriteCategoryTotal"
      class="load-more"
      @tap="store.loadMoreFavorites()"
    >
      加载更多
    </view>
  </view>
</template>

<script setup lang="ts">
import { categories } from '@/services/mock'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const tabs = categories.filter(item => item.id <= 4)

function back() {
  uni.navigateBack()
}

function openVenue(id: number) {
  if (store.favoriteEditMode) {
    store.toggleFavorite(id)
    return
  }

  store.selectVenue(id)
  uni.navigateTo({ url: `/pages/venue/detail/index?id=${id}` })
}
</script>

<style scoped lang="scss">
.favorite-page {
  min-height: 100vh;
  box-sizing: border-box;
  background: #f9fafb;
}

.nav,
.count-line,
.filter-inner,
.favorite-card,
.title-row,
.score-line,
.meta-line,
.bottom-row,
.tag-row,
.price-wrap {
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

.edit {
  width: 40px;
  color: #111827;
  font-size: 14px;
  text-align: right;
}

.count-line {
  height: 32px;
  padding: 0 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
}

.count-line text {
  margin: 0 3px;
  color: #10b981;
  font-size: 15px;
  font-weight: 800;
}

.filter-bar {
  width: 100%;
  height: 42px;
  padding: 0 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
  white-space: nowrap;
}

.filter-inner {
  height: 30px;
  gap: 9px;
}

.filter-chip {
  display: inline-flex;
  min-width: 59px;
  height: 30px;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  box-sizing: border-box;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

.filter-chip.active {
  background: #10b981;
  color: #ffffff;
}

.favorite-list {
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
  box-sizing: border-box;
}

.favorite-card {
  width: 390px;
  height: 129px;
  margin-bottom: 12px;
  padding: 14px;
  box-sizing: border-box;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.cover {
  width: 101px;
  height: 100px;
  flex: 0 0 101px;
  border-radius: 12px;
  background: #e5e7eb;
}

.info {
  min-width: 0;
  flex: 1;
  margin-left: 13px;
}

.title-row {
  height: 24px;
}

.venue-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.heart {
  width: 24px;
  color: #f43f5e;
  font-size: 18px;
  text-align: right;
}

.score-line {
  height: 18px;
  margin-top: 4px;
  gap: 3px;
  color: #6b7280;
  font-size: 12px;
}

.star {
  color: #f59e0b;
}

.meta-line {
  height: 18px;
  justify-content: space-between;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
}

.bottom-row {
  height: 24px;
  justify-content: space-between;
  margin-top: 6px;
}

.tag-row {
  gap: 5px;
}

.tag {
  height: 20px;
  padding: 0 8px;
  border-radius: 8px;
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
}

.tag.blue {
  background: #dbeafe;
  color: #2563eb;
}

.tag.orange {
  background: #ffedd5;
  color: #ea580c;
}

.tag.purple {
  background: #ede9fe;
  color: #8b5cf6;
}

.price-wrap {
  align-items: baseline;
}

.price {
  color: #f43f5e;
  font-size: 17px;
  font-weight: 800;
}

.unit {
  color: #9ca3af;
  font-size: 11px;
}

.empty,
.load-more {
  height: 52px;
  background: #ffffff;
  color: #9ca3af;
  font-size: 13px;
  line-height: 52px;
  text-align: center;
}
</style>
