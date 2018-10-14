import Vue from 'vue'
import App from './App.vue'
import router from './router'
import databaseConnection from './scripts/databaseConnection.js'
import AsyncComputed from 'vue-async-computed'
const electron = window.require('electron')

Vue.config.productionTip = false
Vue.prototype.$electron = electron
Vue.prototype.$database = databaseConnection
Vue.use(AsyncComputed)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
