import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from './App.vue'
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
const app = createApp(App)

app.use(pinia)
app.use(VueQueryPlugin)

app.mount('#app')
