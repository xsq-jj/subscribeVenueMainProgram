<template>
  <view class="page-shell record-page">
    <view class="nav">
      <text class="ri ri-arrow-left-s-line back" @tap="back"></text>
      <text class="title">运动记录</text>
      <view class="filter" @tap="showFilter = !showFilter">
        <text class="ri ri-filter-3-line filter-icon"></text>
        <text>筛选</text>
      </view>
    </view>

    <view class="stats-wrap">
      <view class="stats">
        <view class="stat">
          <text class="stat-value">{{ store.recordStats.count }}</text>
          <text class="stat-label">总次数</text>
        </view>
        <view class="divider" />
        <view class="stat">
          <text class="stat-value">{{ store.recordStats.hours }}h</text>
          <text class="stat-label">总时长</text>
        </view>
        <view class="divider" />
        <view class="stat">
          <text class="stat-value">¥{{ amountK }}</text>
          <text class="stat-label">总消费</text>
        </view>
      </view>
    </view>

    <view v-if="showFilter" class="filter-panel">
      <view
        v-for="item in filterTabs"
        :key="item"
        class="filter-chip"
        :class="{ active: store.recordFilter === item }"
        @tap="selectFilter(item)"
      >
        {{ item === 'ALL' ? '全部' : item }}
      </view>
    </view>

    <view class="type-section">
      <text class="section-title">运动类型分布</text>
      <view class="type-grid">
        <view
          v-for="item in store.recordTypeStats"
          :key="item.type"
          :class="['type-card', sportToneClass(item.type)]"
          @tap="selectFilter(item.type)"
        >
          <view class="type-icon">
            <text :class="['ri', sportIconClass(item.type)]"></text>
          </view>
          <text class="type-count">{{ item.count }}</text>
          <text class="type-name">{{ item.type }}</text>
        </view>
      </view>
    </view>

    <view class="month-section">
      <view class="month-head">
        <text class="ri ri-arrow-left-s-line"></text>
        <text>2025年1月</text>
        <text class="ri ri-arrow-right-s-line"></text>
      </view>
      <view class="chart">
        <view v-for="bar in bars" :key="bar.week" class="bar-item">
          <view class="bar-track">
            <view class="bar" :style="{ height: bar.height + 'px' }" />
          </view>
          <text>{{ bar.week }}</text>
        </view>
      </view>
    </view>

    <view class="record-section">
      <text class="section-title">最近记录</text>
      <view class="record-list">
        <view v-for="record in store.filteredRecords" :key="record.id" class="record-card">
          <view :class="['record-icon', sportToneClass(record.sportType)]">
            <text :class="['ri', sportIconClass(record.sportType)]"></text>
          </view>
          <view class="record-main">
            <text class="venue-name">{{ record.venueName }}</text>
            <text class="record-meta">{{ record.dateText }} {{ record.timeText }} · {{ record.durationHour }}小时</text>
          </view>
          <view class="record-right">
            <text class="record-price">¥{{ record.amount }}</text>
            <text :class="['record-status', record.status === 'CANCELLED' ? 'cancelled' : 'done']">
              {{ record.status === 'CANCELLED' ? '已取消' : '已完成' }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="load-more" @tap="store.toggleRecordExpanded()">
      {{ store.recordExpanded ? '收起记录' : '查看全部记录' }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBookingStore } from '@/stores/booking'

const store = useBookingStore()
const showFilter = ref(false)
const filterTabs = ['ALL', '篮球', '羽毛球', '网球', '游泳']
const bars = [
  { week: '第1周', height: 70 },
  { week: '第2周', height: 105 },
  { week: '第3周', height: 140 },
  { week: '第4周', height: 105 },
  { week: '第5周', height: 35 }
]

const amountK = computed(() => (store.recordStats.amount / 1000).toFixed(1) + 'k')

function back() {
  uni.navigateBack()
}

function selectFilter(type: string) {
  store.setRecordFilter(type)
}

function sportIconClass(type: string) {
  if (type === '篮球') return 'ri-basketball-line'
  if (type === '羽毛球') return 'ri-base-station-line'
  if (type === '网球') return 'ri-football-line'
  return 'ri-more-line'
}

function sportToneClass(type: string) {
  if (type === '篮球') return 'tone-blue'
  if (type === '羽毛球') return 'tone-green'
  if (type === '网球') return 'tone-amber'
  return 'tone-purple'
}
</script>

<style scoped lang="scss">
.record-page {
  min-height: 100vh;
  box-sizing: border-box;
  background: #f9fafb;
}

.nav,
.filter,
.stats,
.stat,
.filter-panel,
.type-grid,
.type-card,
.type-icon,
.month-head,
.chart,
.bar-item,
.bar-track,
.record-card,
.record-icon {
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

.filter {
  width: 52px;
  justify-content: flex-end;
  gap: 5px;
  color: #6b7280;
  font-size: 13px;
}

.filter-icon {
  font-size: 18px;
}

.stats-wrap {
  padding: 0 20px 16px;
  box-sizing: border-box;
  background: #ffffff;
}

.stats {
  width: 390px;
  height: 88px;
  justify-content: space-around;
  border-radius: 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.stat {
  width: 118px;
  height: 56px;
  justify-content: center;
  flex-direction: column;
}

.stat-value {
  color: #2563eb;
  font-size: 26px;
  font-weight: 900;
  line-height: 32px;
}

.stat-label {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
}

.divider {
  width: 1px;
  height: 48px;
  background: rgba(37, 99, 235, 0.2);
}

.filter-panel {
  flex-wrap: wrap;
  gap: 9px;
  padding: 12px 20px;
  background: #ffffff;
}

.filter-chip {
  height: 30px;
  padding: 0 15px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  line-height: 30px;
}

.filter-chip.active {
  background: #10b981;
  color: #ffffff;
}

.type-section {
  padding: 0 20px 16px;
  border-bottom: 8px solid #f3f4f6;
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

.type-grid {
  width: 390px;
  height: 114px;
  margin-top: 12px;
}

.type-card {
  width: 90.75px;
  height: 114px;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  background: #eff6ff;
}

.type-card + .type-card {
  margin-left: 9px;
}

.type-card.tone-green {
  background: #ecfdf5;
}

.type-card.tone-amber {
  background: #fffbeb;
}

.type-card.tone-purple {
  background: #f5f3ff;
}

.type-icon {
  width: 44px;
  height: 44px;
  justify-content: center;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  color: #2563eb;
  font-size: 22px;
}

.tone-green .type-icon,
.record-icon.tone-green {
  background: #d1fae5;
  color: #10b981;
}

.tone-amber .type-icon,
.record-icon.tone-amber {
  background: #fef3c7;
  color: #f59e0b;
}

.tone-purple .type-icon,
.record-icon.tone-purple {
  background: #ede9fe;
  color: #8b5cf6;
}

.type-count {
  margin-top: 6px;
  color: #111827;
  font-size: 18px;
  font-weight: 900;
}

.type-name {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
}

.month-section {
  padding: 16px 20px 16px;
  border-bottom: 8px solid #f3f4f6;
  box-sizing: border-box;
  background: #ffffff;
}

.month-head {
  width: 390px;
  height: 27px;
  justify-content: space-between;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.chart {
  position: relative;
  width: 390px;
  height: 180px;
  justify-content: space-around;
  margin-top: 16px;
  align-items: flex-end;
  overflow: hidden;
  background-image: linear-gradient(to bottom, transparent 34px, #f3f4f6 35px, transparent 36px),
    linear-gradient(to bottom, transparent 69px, #f3f4f6 70px, transparent 71px),
    linear-gradient(to bottom, transparent 104px, #f3f4f6 105px, transparent 106px),
    linear-gradient(to bottom, transparent 139px, #e5e7eb 140px, transparent 141px);
  background-size: 100% 100%;
}

.bar-item {
  width: 54px;
  justify-content: flex-end;
  flex-direction: column;
}

.bar-track {
  height: 150px;
  align-items: flex-end;
}

.bar {
  width: 28px;
  border-radius: 6px 6px 0 0;
  background: #60a5fa;
}

.bar-item:first-child .bar,
.bar-item:last-child .bar {
  background: #dbeafe;
}

.bar-item text {
  margin-top: 8px;
  color: #9ca3af;
  font-size: 11px;
}

.record-section {
  padding: 16px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.record-list {
  margin-top: 12px;
}

.record-card {
  width: 390px;
  height: 76px;
  margin-bottom: 10px;
  padding: 14px 16px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #f9fafb;
}

.record-icon {
  width: 48px;
  height: 48px;
  justify-content: center;
  border-radius: 16px;
  background: #dbeafe;
  color: #2563eb;
  font-size: 24px;
}

.record-main {
  min-width: 0;
  flex: 1;
  margin-left: 13px;
}

.venue-name {
  display: block;
  overflow: hidden;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-meta {
  display: block;
  overflow: hidden;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-right {
  display: flex;
  width: 52px;
  align-items: flex-end;
  flex-direction: column;
}

.record-price {
  color: #f43f5e;
  font-size: 14px;
  font-weight: 800;
}

.record-status {
  margin-top: 4px;
  font-size: 11px;
}

.done {
  color: #10b981;
}

.cancelled {
  color: #ef4444;
}

.load-more {
  height: 52px;
  background: #ffffff;
  color: #9ca3af;
  font-size: 13px;
  line-height: 52px;
  text-align: center;
}
</style>
