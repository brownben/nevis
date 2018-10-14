import Vue from 'vue'
import Router from 'vue-router'

import Database from './views/Database.vue'
import Dashboard from './views/Dashboard.vue'
import Entries from './views/Entries.vue'
import EntryForm from './views/EntryForm.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Database,
    },
    {
      path: '/dashboard',
      component: Dashboard,
    },
    {
      path: '/entries',
      component: Entries,
    },
    {
      path: '/entries/add',
      component: EntryForm,
    },
    {
      path: '/entries/update/:id',
      component: EntryForm,
    },
    {
      path: '/about',
      component: About,
    },
  ],
})
