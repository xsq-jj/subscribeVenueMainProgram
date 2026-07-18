import App from './App.vue'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/icon-font.scss'
import './uni.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return {
    app
  }
}
