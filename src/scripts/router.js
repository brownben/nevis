import Vue from 'vue'
import Router from 'vue-router'

import Database from '../views/Database'
import EventForm from '../views/EventForm'
import Dashboard from '../views/Dashboard'
import Entries from '../views/Entries'
import EntryForm from '../views/EntryForm'
import Courses from '../views/Courses'
import CoursesForm from '../views/CoursesForm'
import Download from '../views/Download'
import SafetyCheck from '../views/SafetyCheck'
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
      path: '/event/add',
      component: EventForm,
    },
    {
      path: '/event/edit',
      component: EventForm,
    },
    {
      path: '/event/restore',
      component: EventForm,
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
      path: '/safety-check',
      component: SafetyCheck,
    },
    {
      path: '/download',
      component: Download,
    },
    {
      path: '/about',
      component: About,
    },

  ],
})
