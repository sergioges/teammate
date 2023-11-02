import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/scss/main.scss'
import App from '@/App.vue'
import router from '@/router/router'
import { i18n } from './plugins/i18n'

const app = createApp(App)
const pinia = createPinia(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
