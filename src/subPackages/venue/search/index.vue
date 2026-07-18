<template>
  <view class="page-shell search-page">
    <view class="search-nav">
      <view class="search-box">
        <text class="ri ri-search-line"></text>
        <input v-model="keyword" confirm-type="search" placeholder="搜索运动场地、场馆名称" @confirm="runSearch" />
        <text v-if="keyword" class="ri ri-close-line clear" @tap="clearKeyword"></text>
      </view>
      <text class="cancel" @tap="back">取消</text>
    </view>

    <view v-if="keyword && !hasSearched" class="suggest-panel">
      <view v-for="item in store.searchSuggestions" :key="item.id" class="suggest-row" @tap="selectKeyword(item.name)">
        <text class="ri ri-search-line"></text>
        <text class="suggest-name">{{ item.name }}</text>
        <text>{{ item.district }}</text>
      </view>
      <view v-if="store.searchSuggestions.length === 0" class="empty small">暂无搜索建议</view>
    </view>

    <view v-if="hasSearched && keyword" class="result-panel">
      <text class="section-title">搜索结果</text>
      <view v-for="venue in store.searchResultVenues" :key="venue.id" class="result-card" @tap="openVenue(venue.id)">
        <image class="cover" :src="venue.cover" mode="aspectFill" />
        <view class="result-main">
          <text class="venue-name">{{ venue.name }}</text>
          <text class="venue-meta">{{ venue.district }} · {{ venue.address }} · {{ venue.distance }}</text>
          <text class="venue-tags">{{ venue.tags.join(' / ') }}</text>
        </view>
        <text class="price">¥{{ venue.minPrice }}</text>
      </view>
      <view v-if="store.searchResultVenues.length === 0" class="empty">未找到相关场馆，可换个关键词试试</view>
    </view>

    <template v-if="!hasSearched">
      <view class="panel">
        <view class="panel-head">
          <text class="section-title">搜索历史</text>
          <view class="clear-history" @tap="store.clearSearchHistory()">
            <text class="ri ri-delete-bin-line"></text>
            <text>清空</text>
          </view>
        </view>
        <view class="chips">
          <view v-for="item in store.searchHistory" :key="item" class="chip" @tap="selectKeyword(item)">{{ item }}</view>
        </view>
      </view>

      <view class="panel hot-panel">
        <text class="section-title">热门搜索</text>
        <view v-for="(item, index) in store.hotSearchWords" :key="item" class="hot-row" @tap="selectKeyword(item)">
          <text class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
          <text class="hot-word">{{ item }}</text>
          <view class="hot-count">
            <text class="ri ri-fire-line"></text>
            <text>{{ hotCount(item, index) }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { venueDetailRoute } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { goBack, navigateTo } from '@/utils/router'

const store = useBookingStore()
const keyword = ref(store.searchKeyword || '奥体中心')
const hasSearched = ref(Boolean(store.searchKeyword))
let pickingKeyword = false

store.setSearchKeyword(keyword.value)

onLoad(() => {
  void store.loadHotSearchWords()
})

watch(keyword, value => {
  store.setSearchKeyword(value)
  if (!pickingKeyword) hasSearched.value = false
  pickingKeyword = false
})

function runSearch() {
  if (!keyword.value.trim()) return
  store.runSearch(keyword.value)
  hasSearched.value = true
}

function selectKeyword(value: string) {
  const same = keyword.value === value
  pickingKeyword = !same
  keyword.value = value
  store.runSearch(value)
  hasSearched.value = true
}

function clearKeyword() {
  keyword.value = ''
  store.setSearchKeyword('')
  hasSearched.value = false
}

function openVenue(id: number) {
  store.selectVenue(id)
  store.runSearch(keyword.value)
  navigateTo(venueDetailRoute(id))
}

function back() {
  goBack()
}

function hotCount(keyword: string, index: number) {
  const heat = store.hotWordHeats[keyword] || Math.max(0, 2300 - index * 250)
  return heat >= 1000 ? `${Number((heat / 1000).toFixed(1))}k` : String(heat)
}
</script>

<style scoped lang="scss">
.search-page {
  min-height: 100vh;
  background: #f6f7f9;
}

.search-nav {
  display: flex;
  align-items: center;
  gap: 23rpx;
  padding: 84rpx 35rpx 21rpx;
  background: #ffffff;
}

.search-box {
  display: flex;
  height: 77rpx;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 16rpx;
  padding: 0 21rpx;
  border-radius: 21rpx;
  background: #f9fafb;
  color: #9ca3af;
  font-size: 31rpx;
}

.search-box input {
  min-width: 0;
  flex: 1;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 400;
}

.clear {
  display: flex;
  width: 35rpx;
  height: 35rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: #d1d5db;
  color: #ffffff;
  font-size: 21rpx;
}

.cancel {
  color: #6b7280;
  font-size: 24rpx;
  font-weight: 500;
}

.suggest-panel,
.panel,
.result-panel {
  padding: 28rpx 35rpx;
  background: #ffffff;
}

.suggest-panel,
.panel {
  margin-bottom: 14rpx;
}

.suggest-row,
.hot-row,
.panel-head,
.clear-history,
.result-card,
.hot-count {
  display: flex;
  align-items: center;
}

.suggest-row {
  min-height: 77rpx;
  border-bottom: 1rpx solid #edf0f4;
  color: #9ca3af;
  font-size: 28rpx;
  font-weight: 400;
}

.suggest-name {
  min-width: 0;
  flex: 1;
  margin-left: 23rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 400;
}

.section-title {
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.panel-head {
  justify-content: space-between;
}

.clear-history {
  gap: 9rpx;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 21rpx;
}

.chip {
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 400;
  line-height: 52rpx;
}

.hot-row {
  min-height: 77rpx;
}

.rank {
  width: 42rpx;
  height: 42rpx;
  border-radius: 14rpx;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 900;
  line-height: 42rpx;
  text-align: center;
}

.rank.top {
  background: #fef3c7;
  color: #f59e0b;
}

.hot-word {
  min-width: 0;
  flex: 1;
  margin-left: 23rpx;
  color: #1a1a2e;
  font-size: 24rpx;
  font-weight: 500;
}

.hot-count {
  gap: 9rpx;
  color: #f59e0b;
  font-size: 21rpx;
  font-weight: 400;
}

.result-card {
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 26rpx rgba(15, 23, 42, 0.05);
}

.cover {
  width: 160rpx;
  height: 160rpx;
  flex: 0 0 160rpx;
  border-radius: 18rpx;
}

.result-main {
  min-width: 0;
  flex: 1;
  margin-left: 22rpx;
}

.venue-name {
  display: block;
  color: #111827;
  font-size: 30rpx;
  font-weight: 900;
}

.venue-meta,
.venue-tags {
  display: block;
  overflow: hidden;
  margin-top: 12rpx;
  color: #7f8a9b;
  font-size: 24rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  margin-left: 14rpx;
  color: #ff3b6b;
  font-size: 34rpx;
  font-weight: 900;
}

.empty {
  padding: 70rpx 0;
  color: #9aa3b2;
  font-size: 26rpx;
  text-align: center;
}

.empty.small {
  padding: 36rpx 0;
}
</style>
