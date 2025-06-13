import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Firebase is initialized when ./firebase.js is imported, typically in App.vue or router/index.js
// No explicit initializeFirebase() call is needed here anymore.

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')