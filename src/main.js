import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import App from './App.vue'
import router from './scripts/router'
import databaseConnection from './scripts/database/connection'
import messageStore from './scripts/messageStore'
import port from './scripts/port'
import si from './scripts/SI/si'
import time from './scripts/time'

const electron = window.require('electron')
const fs = window.require('fs')
const http = window.require('http')

Vue.config.productionTip = false
Vue.prototype.$electron = electron
Vue.prototype.$node = {
  http: http,
  fs: fs,
}
Vue.prototype.$database = databaseConnection
Vue.prototype.$messages = messageStore
Vue.prototype.$port = port
Vue.prototype.$si = si
Vue.prototype.$time = time

Vue.use(AsyncComputed)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
