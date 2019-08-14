import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/tailwind.pcss'
const electron = window.require('electron')

Vue.config.productionTip = false
Vue.prototype.$electron = electron

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
