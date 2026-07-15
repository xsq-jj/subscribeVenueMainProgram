<template>
  <view class="page-shell search-page">
    <view class="top-search">
      <view class="search-row">
        <view class="search-box">
          <text class="ri ri-search-line search-icon"></text>
          <input
            v-model="keyword"
            class="search-input"
            confirm-type="search"
            placeholder="搜索运动场地、场馆名称"
            @confirm="runSearch"
          />
          <text v-if="keyword" class="ri ri-close-line clear" @tap="clearKeyword"></text>
        </view>
        <text class="cancel" @tap="back">取消</text>
      </view>
    </view>

    <view v-if="keyword && !hasSearched" class="suggest-section">
      <view
        v-for="item in store.searchSuggestions"
        :key="item.id"
        class="suggest-row"
        @tap="selectKeyword(item.name)"
      >
        <text class="ri ri-search-line suggest-icon"></text>
        <text class="suggest-name">{{ item.name }}</text>
        <text class="suggest-district">{{ item.district }}</text>
      </view>
      <view v-if="store.searchSuggestions.length === 0" class="empty compact">
        暂无搜索建议
      </view>
    </view>

    <view v-if="hasSearched && keyword && store.searchResultVenues.length" class="result-section">
      <view class="section-title">搜索结果</view>
      <view
        v-for="venue in store.searchResultVenues"
        :key="venue.id"
        class="result-card"
        @tap="openVenue(venue.id)"
      >
        <image class="venue-cover" :src="venue.cover" mode="aspectFill" />
        <view class="venue-main">
          <text class="venue-name">{{ venue.name }}</text>
          <text class="venue-meta">{{ venue.district }} · {{ venue.address }} · {{ venue.distance }}</text>
          <text class="venue-tags">{{ venue.tags.join(' / ') }}</text>
        </view>
        <text class="venue-price">¥{{ venue.minPrice }}</text>
      </view>
    </view>

    <view v-else-if="hasSearched && keyword" class="empty">
      未找到相关场馆，可换个关键词试试
    </view>

    <view v-if="!hasSearched" class="history-section">
      <view class="section-head">
        <text class="section-title">搜索历史</text>
        <view class="clear-history" @tap="store.clearSearchHistory()">
          <text class="ri ri-delete-bin-line"></text>
          <text>清空</text>
        </view>
      </view>
      <view class="chips">
        <view
          v-for="item in store.searchHistory"
          :key="item"
          class="chip"
          @tap="selectKeyword(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>

    <view v-if="!hasSearched" class="hot-section">
      <view class="section-title">热门搜索</view>
      <view
        v-for="(item, index) in store.hotSearchWords"
        :key="item"
        class="hot-row"
        @tap="selectKeyword(item)"
      >
        <text class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
        <text class="hot-word">{{ item }}</text>
        <view class="hot-count">
          <text class="ri ri-fire-line"></text>
          <text>{{ hotCount(index) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const keyword = ref(store.searchKeyword || '奥体中心')
const hasSearched = ref(Boolean(store.searchKeyword))
let pickingKeyword = false

store.setSearchKeyword(keyword.value)

watch(keyword, value => {
  store.setSearchKeyword(value)
  if (!pickingKeyword) {
    hasSearched.value = false
  }
  pickingKeyword = false
})

function runSearch() {
  if (!keyword.value.trim()) return

  store.runSearch(keyword.value)
  hasSearched.value = true
}

function selectKeyword(value: string) {
  const sameKeyword = keyword.value === value
  pickingKeyword = !sameKeyword
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
  uni.navigateTo({ url: `/pages/venue/detail/index?id=${id}` })
}

function back() {
  uni.navigateBack()
}

function hotCount(index: number) {
  return ['2.3k', '1.8k', '1.5k', '1.2k', '986', '756', '623', '512'][index] || '500'
}
</script>

<style scoped lang="scss">
.search-page {
  min-height: 100vh;
  box-sizing: border-box;
  background: #f9fafb;
}

.top-search,
.search-row,
.search-box,
.suggest-row,
.section-head,
.clear-history,
.hot-row,
.hot-count,
.result-card {
  display: flex;
  align-items: center;
}

.top-search {
  padding: 48px 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.search-row {
  width: 390px;
  height: 44px;
}

.search-box {
  width: 348px;
  height: 44px;
  padding: 0 14px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #f9fafb;
}

.search-icon,
.suggest-icon {
  color: #9ca3af;
  font-size: 20px;
}

.search-input {
  min-width: 0;
  flex: 1;
  margin-left: 9px;
  color: #111827;
  font-size: 14px;
}

.clear {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #d1d5db;
  color: #ffffff;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

.cancel {
  width: 29px;
  margin-left: 13px;
  color: #374151;
  font-size: 14px;
  text-align: right;
}

.suggest-section {
  padding: 0 20px 16px;
  border-bottom: 8px solid #f3f4f6;
  background: #ffffff;
}

.suggest-row {
  width: 390px;
  height: 48px;
  border-bottom: 1px solid #edf0f4;
  color: #111827;
  font-size: 14px;
}

.suggest-row:last-child {
  border-bottom: none;
}

.suggest-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  margin-left: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggest-district {
  color: #9ca3af;
  font-size: 12px;
}

.history-section {
  padding: 16px 20px;
  border-bottom: 8px solid #f3f4f6;
  box-sizing: border-box;
  background: #ffffff;
}

.section-head {
  height: 22px;
  justify-content: space-between;
}

.section-title {
  display: block;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
}

.clear-history {
  gap: 5px;
  color: #9ca3af;
  font-size: 12px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.chip {
  height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  line-height: 30px;
}

.hot-section {
  padding: 16px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.hot-row {
  width: 390px;
  height: 44px;
}

.rank {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #eef0f4;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
}

.rank.top {
  background: #fef3c7;
  color: #f59e0b;
}

.hot-word {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  margin-left: 13px;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-count {
  gap: 5px;
  color: #f59e0b;
  font-size: 12px;
}

.result-section {
  padding: 16px 20px;
}

.result-card {
  width: 390px;
  min-height: 112px;
  margin-top: 12px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.venue-cover {
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  border-radius: 12px;
  background: #e5e7eb;
}

.venue-main {
  min-width: 0;
  flex: 1;
  margin-left: 12px;
}

.venue-name {
  display: block;
  overflow: hidden;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.venue-meta,
.venue-tags {
  display: block;
  overflow: hidden;
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.venue-price {
  margin-left: 8px;
  color: #f43f5e;
  font-size: 16px;
  font-weight: 900;
}

.empty {
  padding: 60px 0;
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
}

.empty.compact {
  padding: 24px 0;
}
</style>
