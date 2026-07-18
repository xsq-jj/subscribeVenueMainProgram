<template>
  <view class="page-shell record-page">
    <view class="record-nav">
      <view class="nav-left" @tap="goBack()">
        <text class="ri ri-arrow-left-s-line"></text>
        <text class="nav-title">运动记录</text>
      </view>
      <view class="nav-filter">
        <text class="ri ri-filter-3-line"></text>
        <text>筛选</text>
      </view>
    </view>

    <view class="stats-section">
      <view class="summary">
        <view class="summary-item"><text>{{ store.recordStats.count }}</text><text>总次数</text></view>
        <view class="summary-divider"></view>
        <view class="summary-item"><text>{{ store.recordStats.hours }}h</text><text>总时长</text></view>
        <view class="summary-divider"></view>
        <view class="summary-item"><text>¥{{ summaryAmount }}</text><text>总消费</text></view>
      </view>
    </view>

    <view class="type-section">
      <text class="section-title">运动类型分布</text>
      <view class="type-grid">
        <view
          v-for="item in typeStats"
          :key="item.type"
          class="type-card"
          :class="[item.theme, { active: store.recordFilter === item.filter }]"
          @tap="store.setRecordFilter(item.filter)"
        >
          <view class="type-icon" :class="item.theme">
            <text :class="['ri', item.icon]"></text>
          </view>
          <text class="type-count">{{ item.count }}</text>
          <text class="type-name">{{ item.type }}</text>
        </view>
      </view>
    </view>

    <view class="chart-section">
      <view class="month-row">
        <text class="ri ri-arrow-left-s-line month-arrow"></text>
        <text class="month-title">{{ currentMonthTitle }}</text>
        <text class="ri ri-arrow-right-s-line month-arrow"></text>
      </view>
      <view class="chart-board">
        <text class="axis-label axis-6">6次</text>
        <text class="axis-label axis-4">4次</text>
        <text class="axis-label axis-2">2次</text>
        <text class="axis-label axis-0">0次</text>
        <view class="grid-line grid-6"></view>
        <view class="grid-line grid-4"></view>
        <view class="grid-line grid-2"></view>
        <view class="grid-line grid-0"></view>
        <view class="bar-list">
          <view v-for="bar in bars" :key="bar.label" class="bar-item">
            <view class="bar-space">
              <view class="bar" :class="bar.tone" :style="{ height: bar.height + 'rpx' }"></view>
            </view>
            <text>{{ bar.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="records-section">
      <text class="section-title">最近记录</text>
      <view v-if="store.loadingRecords" class="state-box">运动记录加载中...</view>
      <view v-else-if="store.recordError && store.records.length === 0" class="state-box">
        <text>{{ store.recordError }}</text>
        <view class="retry-btn" @tap="store.loadRecordData()">重试</view>
      </view>
      <template v-else>
      <view v-for="record in store.filteredRecords" :key="record.id" class="record-card">
        <view class="record-icon" :class="recordTheme(record.sportType)">
          <text :class="['ri', sportIcon(record.sportType)]"></text>
        </view>
        <view class="record-main">
          <text class="record-title">{{ record.venueName }}</text>
          <view class="record-meta">
            <text>{{ record.dateText }} {{ record.timeText }}</text>
            <text class="meta-dot">·</text>
            <text>{{ record.durationHour }}小时</text>
          </view>
        </view>
        <view class="record-price">
          <text>¥{{ record.amount }}</text>
          <text :class="{ cancel: record.status === 'CANCELLED' }">{{ record.status === 'CANCELLED' ? '已取消' : '已完成' }}</text>
        </view>
      </view>
      <view class="load-more" @tap="store.toggleRecordExpanded()">
        {{ store.recordExpanded ? '收起记录' : '查看全部记录' }}
        <text class="ri ri-arrow-down-s-line"></text>
      </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useBookingStore } from '@/stores/booking'
import { goBack } from '@/utils/router'

const store = useBookingStore()

onShow(() => {
  void store.loadRecordData()
})

const typeMeta = [
  { type: '篮球', filter: '篮球', icon: 'ri-basketball-line', theme: 'blue' },
  { type: '羽毛球', filter: '羽毛球', icon: 'ri-base-station-line', theme: 'green' },
  { type: '网球', filter: '网球', icon: 'ri-billiards-line', theme: 'yellow' },
  { type: '其他', filter: '其他', icon: 'ri-more-line', theme: 'purple' }
]

const typeStats = computed(() => {
  const stats = store.recordTypeStats
  const mainTypes = ['篮球', '羽毛球', '网球']
  return typeMeta.map(item => {
    const count = item.type === '其他'
      ? stats.filter(stat => !mainTypes.includes(stat.type)).reduce((sum, stat) => sum + stat.count, 0)
      : stats.find(stat => stat.type === item.type)?.count || 0

    return { ...item, count }
  })
})

const currentMonthTitle = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月`
})
const currentMonthKey = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const summaryAmount = computed(() => {
  const amount = Number(store.recordStats.amount || 0)
  return amount >= 1000 ? `${Number((amount / 1000).toFixed(1))}k` : amount
})

const bars = computed(() => {
  const weekCounts = [0, 0, 0, 0, 0]
  store.records.forEach(record => {
    if (!record.slotDate || record.status === 'CANCELLED') return
    if (!record.slotDate.startsWith(currentMonthKey.value)) return
    const day = Number(record.slotDate.split('-')[2])
    const index = Math.min(Math.floor((day - 1) / 7), 4)
    weekCounts[index] += 1
  })

  const max = Math.max(...weekCounts, 1)
  return weekCounts.map((count, index) => ({
    label: `第${index + 1}周`,
    height: count ? Math.max(28, Math.round((count / max) * 244)) : 0,
    tone: count === max ? 'strong' : count >= max / 2 ? 'medium' : 'light'
  }))
})

function recordTheme(type: string) {
  if (type === '篮球') return 'blue'
  if (type === '羽毛球') return 'green'
  if (type === '网球') return 'yellow'
  return 'purple'
}

function sportIcon(type: string) {
  if (type === '篮球') return 'ri-basketball-line'
  if (type === '羽毛球') return 'ri-base-station-line'
  if (type === '网球') return 'ri-billiards-line'
  if (type === '足球') return 'ri-football-line'
  if (type === '乒乓球') return 'ri-ping-pong-line'
  if (type === '游泳') return 'ri-drop-line'
  return 'ri-more-line'
}
</script>

<style scoped lang="scss">
.record-page {
  min-height: 100vh;
  background: #f6f7f9;
  color: #111827;
}

.record-nav {
  display: flex;
  height: 157rpx;
  align-items: center;
  justify-content: space-between;
  padding: 59rpx 35rpx 24rpx;
  box-sizing: border-box;
  background: #ffffff;
}

.nav-left {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 21rpx;
}

.nav-left .ri {
  width: 38rpx;
  height: 45rpx;
  color: #111827;
  font-size: 38rpx;
}

.nav-title {
  color: #111827;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 1.2;
}

.nav-filter {
  display: flex;
  align-items: center;
  gap: 9rpx;
  color: #6b7280;
  font-size: 23rpx;
  line-height: 1;
}

.nav-filter .ri {
  color: #6b7280;
  font-size: 31rpx;
}

.stats-section {
  padding: 14rpx 35rpx;
  background: #ffffff;
}

.summary {
  display: flex;
  height: 153rpx;
  align-items: center;
  overflow: hidden;
  border-radius: 28rpx;
  background: #cfe1fb;
}

.summary-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #64748b;
  font-size: 21rpx;
  font-weight: 400;
  line-height: 1.25;
}

.summary-item text:first-child {
  margin-bottom: 10rpx;
  color: #2563eb;
  font-size: 49rpx;
  font-weight: 800;
  line-height: 1;
}

.summary-divider {
  width: 3rpx;
  height: 84rpx;
  background: rgba(37, 99, 235, 0.18);
}

.type-section,
.chart-section,
.records-section {
  background: #ffffff;
}

.chart-section {
  margin-top: 14rpx;
  padding: 51rpx 35rpx 5rpx;
}

.type-section {
  padding: 0 35rpx 28rpx;
}

.section-title {
  display: block;
  margin: 0 0 21rpx;
  color: #1a1a2e;
  font-size: 26rpx;
  font-weight: 800;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.type-card {
  display: flex;
  height: 199rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 21rpx;
  box-sizing: border-box;
}

.type-card.blue { background: #eff6ff; }
.type-card.green { background: #ecfdf5; }
.type-card.yellow { background: #fffbeb; }
.type-card.purple { background: #f5f3ff; }

.type-card.active:not(.blue) {
  box-shadow: inset 0 0 0 2rpx rgba(16, 185, 129, 0.16);
}

.type-card.active.blue {
  box-shadow: inset 0 0 0 2rpx rgba(37, 99, 235, 0.14);
}

.type-icon {
  display: flex;
  width: 77rpx;
  height: 77rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  font-size: 35rpx;
}

.type-icon .ri {
  font-size: 37rpx;
}

.type-icon.blue { background: #dbeafe; color: #2563eb; }
.type-icon.green { background: #d1fae5; color: #10b981; }
.type-icon.yellow { background: #fef3c7; color: #f59e0b; }
.type-icon.purple { background: #ede9fe; color: #8b5cf6; }

.type-count {
  margin-top: 14rpx;
  color: #111827;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 1.15;
}

.type-name {
  margin-top: 5rpx;
  color: #6b7280;
  font-size: 21rpx;
  line-height: 1.2;
}

.month-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 47rpx;
  color: #111827;
  font-size: 26rpx;
  font-weight: 800;
}

.month-arrow {
  width: 35rpx;
  height: 47rpx;
  color: #9ca3af;
  font-size: 31rpx;
}

.month-title {
  flex: 1;
  text-align: center;
}

.chart-board {
  position: relative;
  height: 314rpx;
  margin-top: 28rpx;
}

.axis-label {
  position: absolute;
  left: 0;
  width: 45rpx;
  color: #94a3b8;
  font-size: 20rpx;
  line-height: 1;
}

.axis-6 { top: 0; }
.axis-4 { top: 81rpx; }
.axis-2 { top: 164rpx; }
.axis-0 { top: 247rpx; }

.grid-line {
  position: absolute;
  left: 55rpx;
  right: 0;
  height: 1rpx;
  border-top: 1rpx dashed #e5e7eb;
}

.grid-6 { top: 7rpx; }
.grid-4 { top: 90rpx; }
.grid-2 { top: 173rpx; }
.grid-0 {
  top: 256rpx;
  border-top-style: solid;
}

.bar-list {
  position: absolute;
  left: 55rpx;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 295rpx;
}

.bar-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  color: #9ca3af;
  font-size: 20rpx;
  line-height: 1;
}

.bar-space {
  display: flex;
  height: 256rpx;
  align-items: flex-end;
}

.bar {
  width: 56rpx;
  border-radius: 2rpx 2rpx 0 0;
}

.bar.light { background: #dbeafe; }
.bar.medium { background: #93c5fd; }
.bar.strong { background: #60a5fa; }

.bar-item text {
  margin-top: 17rpx;
}

.records-section {
  margin-top: 14rpx;
  padding: 35rpx 35rpx 0;
}

.record-card {
  display: flex;
  align-items: center;
  height: 133rpx;
  margin-bottom: 17rpx;
  padding: 0 24rpx;
  border-radius: 21rpx;
  background: #f8fafc;
  box-sizing: border-box;
}

.record-icon {
  display: flex;
  width: 84rpx;
  height: 84rpx;
  flex: 0 0 84rpx;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  font-size: 35rpx;
}

.record-icon .ri {
  font-size: 37rpx;
}

.record-icon.blue { background: #dbeafe; color: #2563eb; }
.record-icon.green { background: #d1fae5; color: #10b981; }
.record-icon.yellow { background: #fef3c7; color: #f59e0b; }
.record-icon.purple { background: #ede9fe; color: #8b5cf6; }

.record-main {
  min-width: 0;
  flex: 1;
  margin-left: 24rpx;
}

.record-title {
  display: block;
  overflow: hidden;
  color: #111827;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-meta {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 17rpx;
  margin-top: 6rpx;
  color: #64748b;
  font-size: 21rpx;
  line-height: 1.25;
  white-space: nowrap;
}

.record-meta text:first-child {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
}

.meta-dot {
  color: #94a3b8;
}

.record-price {
  display: flex;
  width: 67rpx;
  flex: 0 0 67rpx;
  align-items: flex-end;
  flex-direction: column;
  color: #10b981;
  font-size: 21rpx;
  font-weight: 600;
  line-height: 1.2;
}

.record-price text:first-child {
  color: #ff3b6b;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1.1;
}

.record-price .cancel {
  color: #ef4444;
}

.load-more {
  display: flex;
  height: 91rpx;
  align-items: center;
  justify-content: center;
  gap: 9rpx;
  color: #9ca3af;
  font-size: 23rpx;
  text-align: center;
}

.load-more .ri {
  font-size: 28rpx;
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
  background: #2563eb;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
