import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './scripts/router'

import databaseConnection from '@/scripts/database/connection'
import messageStore from '@/scripts/messageStore'
import port from '@/scripts/port'

const electron = window.require('electron')
const fs = window.require('fs')
const printer = window.require('printer')
const thermalPrinter = window.require('node-thermal-printer')

Vue.config.productionTip = false
Vue.prototype.$electron = electron
Vue.prototype.$node = {
  'axios': axios,
  'fs': fs,
  'printer': printer,
  'thermalPrinter': thermalPrinter,
}
Vue.prototype.$database = databaseConnection
Vue.prototype.$messages = messageStore
Vue.prototype.$port = port

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
