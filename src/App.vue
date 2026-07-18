<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { logger } from '@/utils/logger'

onLaunch(() => {
  logger.info('Sport booking app launched')
})

onShow(() => {
  logger.info('Sport booking app show')
})

onHide(() => {
  logger.info('Sport booking app hide')
})
</script>

<style lang="scss">
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
  display: none !important;
}
/* #endif */
</style>
