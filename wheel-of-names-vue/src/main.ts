import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueApexCharts from 'vue3-apexcharts'
import SvgIcon from 'vue3-icon'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives
})

app.use(router)
app.use(vuetify)
app.use(VueApexCharts)
app.component('svg-icon', SvgIcon)

app.mount('#app')
