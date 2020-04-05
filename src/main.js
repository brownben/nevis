import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/tailwind.pcss'
import database from '@/scripts/database'
import archive from '@/scripts/archive'
import messageStore from '@/scripts/messageStore'

const electron = window.require('electron')
const mysql = window.require('mysql')
const fs = window.require('fs').promises
const SerialPort = window.require('serialport')
const xml = require('xml-js')

Vue.config.productionTip = false

Vue.prototype.$electron = electron
Vue.prototype.$mysql = mysql
Vue.prototype.$serialPort = SerialPort
Vue.prototype.$fs = fs
Vue.prototype.$xml = xml
Vue.prototype.$database = database
Vue.prototype.$archive = archive
Vue.prototype.$messages = messageStore

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
