import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 1. PrimeVue Core
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// 2. Componentes PrimeVue
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';

// 3. IMPORTAR ESTILOS (El orden importa)
import './assets/main.css' // Tu Tailwind
import 'primevue/resources/themes/lara-dark-blue/theme.css' // TEMA OSCURO GAMING
import 'primevue/resources/primevue.min.css'              // Estilos base
import 'primeicons/primeicons.css'                       // Iconos

// Crear la aplicación ANTES de usar app.use
const app = createApp(App)

// 4. Configuración de Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 5. Plugins y Middlewares
app.use(pinia)
app.use(router)

// 6. Configuración de PrimeVue
app.use(PrimeVue, { ripple: true })
app.use(ToastService);

// 7. Registrar componentes globalmente
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);

// 8. Montar la app
app.mount('#app')
