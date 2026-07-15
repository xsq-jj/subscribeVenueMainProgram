<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('Sport booking app launched')
})

onShow(() => {
  console.log('Sport booking app show')
})

onHide(() => {
  console.log('Sport booking app hide')
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  min-height: 100%;
  background: #f6f7f9;
  color: #121827;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* #ifdef H5 */
uni-page-body,
uni-page-wrapper {
  max-width: 430px;
  margin: 0 auto;
}

uni-tabbar {
  right: 0 !important;
  left: 50% !important;
  max-width: 430px;
  transform: translateX(-50%);
}
/* #endif */
</style>
