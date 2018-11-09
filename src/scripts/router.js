import Vue from 'vue'
import Router from 'vue-router'

import Database from '../views/Database'
import Dashboard from '../views/Dashboard'
import Download from '../views/Download'
import Entries from '../views/Entries'
import EntryForm from '../views/EntryForm'
import Courses from '../views/Courses'
import CoursesForm from '../views/CoursesForm'
import Results from '../views/Results'
import About from '../views/About'

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
      path: '/results',
      component: Results,
    },
    {
      path: '/about',
      component: About,
    },
  ],
})
