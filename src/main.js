import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './assets/tailwind.css';
import '@fortawesome/fontawesome-free/js/all';
import router from './router';
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';

createApp(App)
    .use(router)
    .use(PrimeVue, {
        unstyled: true,
        theme: {
            preset: Aura,
            
        }
    }).mount('#app');