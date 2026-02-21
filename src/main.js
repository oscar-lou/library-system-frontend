import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next';
import { bootstrapConfig } from '@oruga-ui/theme-bootstrap';
import '../node_modules/@oruga-ui/theme-bootstrap/dist/theme.css';
import '@mdi/font/css/materialdesignicons.min.css';
import VueApexCharts from "vue3-apexcharts";


// import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"

const app = createApp(App)

app.use(router).use(Oruga, bootstrapConfig)
app.use(router).use(Oruga, bootstrapConfig).use(VueApexCharts)


app.mount('#app')