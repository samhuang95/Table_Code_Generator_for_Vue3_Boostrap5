import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Custom styles (includes Bootstrap)
import '@/assets/styles/main.scss'

// Bootstrap JS
import 'bootstrap'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')