import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/tailwind.pcss'
import database from '@/scripts/database'
import messageStore from '@/scripts/messageStore'
const electron = window.require('electron')
const mysql = window.require('mysql')

Vue.config.productionTip = false
Vue.prototype.$electron = electron
Vue.prototype.$mysql = mysql
Vue.prototype.$messages = messageStore
Vue.prototype.$database = database

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
