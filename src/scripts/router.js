import Vue from 'vue'
import Router from 'vue-router'

import Database from '../views/Database.vue'
import Dashboard from '../views/Dashboard.vue'
import Download from '../views/Download.vue'
import Entries from '../views/Entries.vue'
import EntryForm from '../views/EntryForm.vue'
import Courses from '../views/Courses.vue'
import CoursesForm from '../views/CoursesForm'
import About from '../views/About.vue'

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
      path: '/download',
      component: Download,
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
      path: '/courses',
      component: Courses,
    },
    {
      path: '/courses/add',
      component: CoursesForm,
    },
    {
      path: '/courses/update/:id',
      component: CoursesForm,
    },
    {
      path: '/about',
      component: About,
    },
  ],
})
