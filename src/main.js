import Vue from 'vue'
import axios from 'axios'
import AsyncComputed from 'vue-async-computed'
import App from './App.vue'
import router from './scripts/router'
import databaseConnection from './scripts/database/connection'
import messageStore from './scripts/messageStore'
import port from './scripts/port'
import si from './scripts/si/si'
import time from './scripts/time'
import courseMatching from './scripts/courseMatching/courseMatching'

const electron = window.require('electron')
const fs = window.require('fs')

Vue.config.productionTip = false
Vue.prototype.$electron = electron
Vue.prototype.$node = {
  'axios': axios,
  'fs': fs,
}
Vue.prototype.$database = databaseConnection
Vue.prototype.$messages = messageStore
Vue.prototype.$port = port
Vue.prototype.$si = si
Vue.prototype.$time = time
Vue.prototype.$courseMatching = courseMatching

Vue.use(AsyncComputed)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
