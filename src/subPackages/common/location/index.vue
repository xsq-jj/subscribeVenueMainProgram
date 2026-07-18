<template>
  <view class="page-shell location-page">
    <app-nav-bar title="选择位置" show-back />

    <view class="search-box">
      <text class="ri ri-search-line"></text>
      <input v-model="keyword" placeholder="搜索城市或区域" />
    </view>

    <view class="current-card">
      <view class="pin"><text class="ri ri-map-pin-line"></text></view>
      <view>
        <text class="current-title">当前位置</text>
        <text class="current-desc">{{ store.currentCity }}市{{ store.currentRegion }}奥体中心附近</text>
      </view>
      <view class="relocate" @tap="relocate">
        <text class="ri ri-gps-line"></text>
        <text>重新定位</text>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">热门城市</text>
      <view class="city-grid">
        <view
          v-for="city in cities"
          :key="city"
          class="city-chip"
          :class="{ active: store.currentCity === city }"
          @tap="selectCity(city)"
        >
          {{ city }}
        </view>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">{{ store.currentCity }}市 · 区域</text>
      <view v-for="region in store.filteredRegions" :key="region.id" class="region-row" @tap="selectRegion(region.name)">
        <view class="region-icon" :class="{ active: region.name === store.currentRegion }">
          <text class="ri ri-building-4-line"></text>
        </view>
        <view class="region-main">
          <text>{{ region.name }}</text>
          <text>{{ region.name === store.currentRegion ? '当前所在区域 · ' : '' }}{{ region.count }}个场馆</text>
        </view>
        <text v-if="region.name === store.currentRegion" class="ri ri-check-line check"></text>
        <text v-else class="ri ri-arrow-right-s-line arrow"></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppNavBar from '@/components/app-nav-bar/app-nav-bar.vue'
import { ROUTES } from '@/config/routes'
import { useBookingStore } from '@/stores/booking'
import { goBack } from '@/utils/router'

const store = useBookingStore()
const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉']
const keyword = computed({
  get: () => store.locationKeyword,
  set: value => store.setLocationKeyword(value)
})

onLoad(() => {
  void store.loadRegions(store.currentCity)
})

watch(keyword, value => store.setLocationKeyword(value))

function selectCity(city: string) {
  store.currentCity = city
  store.currentRegion = ''
  store.locationKeyword = ''
  void store.loadRegions(city)
}

function selectRegion(region: string) {
  store.selectLocation(store.currentCity, region)
  uni.showToast({ title: `已切换至${region}`, icon: 'none' })
  setTimeout(() => goBack(ROUTES.TAB_HOME), 260)
}

function relocate() {
  store.selectLocation('北京', '朝阳区')
  uni.showToast({ title: '定位成功', icon: 'success' })
}
</script>

<style scoped lang="scss">
.location-page {
  min-height: 100vh;
  background: #f6f7f9;
}

.search-box {
  display: flex;
  height: 77rpx;
  align-items: center;
  gap: 16rpx;
  margin: 0 35rpx 21rpx;
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

.current-card,
.panel {
  background: #ffffff;
}

.current-card {
  display: flex;
  align-items: center;
  padding: 21rpx 35rpx;
  border-bottom: 14rpx solid #f3f4f6;
}

.pin {
  display: flex;
  width: 70rpx;
  height: 70rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: #d1fae5;
  color: #10b981;
  font-size: 35rpx;
}

.current-card > view:nth-child(2) {
  min-width: 0;
  flex: 1;
  margin-left: 23rpx;
}

.current-title,
.current-desc {
  display: block;
}

.current-title {
  color: #111827;
  font-size: 26rpx;
  font-weight: 600;
}

.current-desc {
  margin-top: 0;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.relocate {
  display: flex;
  align-items: center;
  gap: 9rpx;
  color: #10b981;
  font-size: 23rpx;
  font-weight: 400;
}

.panel {
  margin-top: 14rpx;
  padding: 28rpx 35rpx;
}

.section-title {
  display: block;
  margin-bottom: 21rpx;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.city-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 17rpx;
}

.city-chip {
  min-width: 119rpx;
  height: 63rpx;
  padding: 0 35rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 63rpx;
  text-align: center;
  box-sizing: border-box;
}

.city-chip.active {
  background: #10b981;
  color: #ffffff;
}

.region-row {
  display: flex;
  min-height: 119rpx;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #edf0f4;
  box-sizing: border-box;
}

.region-row:last-child {
  border-bottom: none;
}

.region-icon {
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 31rpx;
}

.region-icon.active {
  background: #d1fae5;
  color: #10b981;
}

.region-main {
  min-width: 0;
  flex: 1;
  margin-left: 23rpx;
}

.region-main text:first-child {
  display: block;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 500;
}

.region-main text:last-child {
  display: block;
  margin-top: 0;
  color: #9ca3af;
  font-size: 21rpx;
  font-weight: 400;
}

.check {
  color: #10b981;
  font-size: 34rpx;
}

.arrow {
  color: #c4cad3;
  font-size: 34rpx;
}
</style>
