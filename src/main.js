import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 1. PrimeVue Core
import PrimeVue from 'primevue/config';

// 2. IMPORTAR ESTILOS (El orden importa)
import './assets/main.css' // Tu Tailwind
import 'primevue/resources/themes/lara-dark-blue/theme.css' // TEMA OSCURO GAMING
import 'primevue/resources/primevue.min.css'              // Estilos base
import 'primeicons/primeicons.css'                       // Iconos

// Crear la aplicación ANTES de usar app.use
const app = createApp(App)

// 3. Configuración de Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 4. Plugins y Middlewares
app.use(pinia)
app.use(router)

// Configuración de PrimeVue (Sin el preset Aura que te da error)
app.use(PrimeVue, { ripple: true })

// 5. Montar la app
app.mount('#app')
