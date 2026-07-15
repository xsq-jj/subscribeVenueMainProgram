<template>
  <view class="page-shell location-page">
    <view class="nav">
      <text class="ri ri-arrow-left-s-line back" @tap="back"></text>
      <text class="title">选择位置</text>
    </view>

    <view class="search-area">
      <view class="search-box">
        <text class="ri ri-search-line search-icon"></text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索城市或区域"
        />
      </view>
    </view>

    <view class="current-card">
      <view class="pin">
        <text class="ri ri-map-pin-line"></text>
      </view>
      <view class="current-main">
        <text class="current-title">当前位置</text>
        <text class="current-desc">{{ store.currentCity }}市{{ store.currentRegion }}奥体中心附近</text>
      </view>
      <view class="relocate" @tap="relocate">
        <text class="ri ri-gps-line"></text>
        <text>重新定位</text>
      </view>
    </view>

    <view class="city-section">
      <text class="section-title">热门城市</text>
      <view class="city-grid">
        <view
          v-for="city in hotCities"
          :key="city"
          class="city-chip"
          :class="{ active: store.currentCity === city }"
          @tap="selectCity(city)"
        >
          {{ city }}
        </view>
      </view>
    </view>

    <view class="region-section">
      <text class="section-title">{{ store.currentCity }}市 · 区域</text>
      <view class="region-list">
        <view
          v-for="region in store.filteredRegions"
          :key="region.id"
          class="region-row"
          @tap="selectRegion(region.name)"
        >
          <view class="region-left">
            <view class="region-icon">
              <text class="ri ri-building-4-line"></text>
            </view>
            <view class="region-main">
              <text class="region-name">{{ region.name }}</text>
              <text class="region-desc">
                {{ store.currentRegion === region.name ? '当前所在区域 · ' : '' }}{{ region.count }}个场馆
              </text>
            </view>
          </view>
          <text v-if="store.currentRegion === region.name" class="ri ri-check-line checked"></text>
          <text v-else class="ri ri-arrow-right-s-line arrow"></text>
        </view>
      </view>

      <view v-if="store.filteredRegions.length === 0" class="empty">
        暂无匹配区域
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cityRegions } from '@/services/mock'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const keyword = ref(store.locationKeyword)
const hotCities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉']

watch(keyword, value => {
  store.setLocationKeyword(value)
})

function back() {
  uni.navigateBack()
}

function selectCity(city: string) {
  const firstRegion = cityRegions.find(item => item.city === city)
  store.selectLocation(city, firstRegion?.name || '')
  keyword.value = ''
}

function selectRegion(region: string) {
  store.selectLocation(store.currentCity, region)
}

function relocate() {
  store.selectLocation('北京', '朝阳区')
  keyword.value = ''
}
</script>

<style scoped lang="scss">
.location-page {
  min-height: 100vh;
  box-sizing: border-box;
  background: #f9fafb;
}

.nav,
.search-area,
.search-box,
.current-card,
.pin,
.relocate,
.city-grid,
.city-chip,
.region-row,
.region-left,
.region-icon {
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

.search-area {
  padding: 0 20px 12px;
  box-sizing: border-box;
  background: #ffffff;
}

.search-box {
  width: 390px;
  height: 44px;
  padding: 0 14px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #f9fafb;
}

.search-icon {
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

.current-card {
  padding: 12px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.pin {
  width: 40px;
  height: 40px;
  justify-content: center;
  border-radius: 20px;
  background: #d1fae5;
  color: #10b981;
  font-size: 20px;
}

.current-main {
  min-width: 0;
  flex: 1;
  margin-left: 13px;
}

.current-title,
.region-name {
  display: block;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
}

.current-desc,
.region-desc {
  display: block;
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
}

.relocate {
  gap: 5px;
  color: #10b981;
  font-size: 13px;
  font-weight: 600;
}

.city-section {
  margin-top: 8px;
  padding: 16px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.section-title {
  display: block;
  height: 22px;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
}

.city-grid {
  flex-wrap: wrap;
  gap: 10px;
  width: 390px;
  margin-top: 12px;
}

.city-chip {
  width: 68px;
  height: 36px;
  justify-content: center;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
}

.city-chip.active {
  background: #10b981;
  color: #ffffff;
}

.region-section {
  margin-top: 8px;
  padding: 16px 20px 0;
  box-sizing: border-box;
  background: #ffffff;
}

.region-list {
  width: 390px;
  margin-top: 12px;
}

.region-row {
  width: 390px;
  height: 68px;
  justify-content: space-between;
  border-bottom: 1px solid #edf0f4;
}

.region-left {
  min-width: 0;
  flex: 1;
}

.region-icon {
  width: 36px;
  height: 36px;
  justify-content: center;
  border-radius: 10px;
  background: #ecfdf5;
  color: #10b981;
  font-size: 18px;
}

.region-main {
  min-width: 0;
  flex: 1;
  margin-left: 13px;
}

.checked {
  color: #10b981;
  font-size: 20px;
}

.arrow {
  color: #c7cdd7;
  font-size: 18px;
}

.empty {
  height: 68px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 68px;
  text-align: center;
}
</style>
