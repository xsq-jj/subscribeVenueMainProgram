<template>
  <view class="design-page">
    <view class="design-frame" :style="frameStyle">
      <image class="design-image" :src="src" mode="scaleToFill" />
      <view
        v-for="(item, index) in hotspots"
        :key="item.key || item.action + '-' + index"
        :data-action="item.action"
        :data-key="item.key || item.action + '-' + index"
        class="design-hotspot"
        :style="hotspotStyle(item)"
        @tap.stop="handleTap(item.action)"
      />
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface DesignHotspot {
  key?: string
  action: string
  x: number
  y: number
  width: number
  height: number
}

const props = withDefaults(
  defineProps<{
    src: string
    height: number
    width?: number
    hotspots?: DesignHotspot[]
  }>(),
  {
    width: 430,
    hotspots: () => []
  }
)

const frameWidth = ref(props.width)

try {
  const systemInfo = uni.getSystemInfoSync()
  frameWidth.value = Math.min(systemInfo.windowWidth || props.width, props.width)
} catch {
  frameWidth.value = props.width
}

const emit = defineEmits<{
  action: [action: string]
}>()

const frameStyle = computed(() => ({
  width: `${frameWidth.value}px`,
  height: `${(frameWidth.value / props.width) * props.height}px`
}))

function hotspotStyle(item: DesignHotspot) {
  return {
    left: `${(item.x / props.width) * 100}%`,
    top: `${(item.y / props.height) * 100}%`,
    width: `${(item.width / props.width) * 100}%`,
    height: `${(item.height / props.height) * 100}%`
  }
}

function handleTap(action: string) {
  emit('action', action)
}
</script>

<style scoped lang="scss">
.design-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f5f6f8;
}

.design-frame {
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  background: #f5f6f8;
}

.design-image {
  display: block;
  width: 100%;
  height: 100%;
}

.design-hotspot {
  position: absolute;
  z-index: 2;
  background: rgba(255, 255, 255, 0);
}
</style>
