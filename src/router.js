import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('./views/Events.vue'),
    },
    {
      path: '/events/create',
      name: 'create-event',
      component: () => import('./views/EventForm.vue'),
    },
    {
      path: '/events/edit/:id',
      name: 'edit-event',
      component: () => import('./views/EventForm.vue'),
    },
    {
      path: '/events/:id',
      name: 'event-overview',
      component: () => import('./views/EventOverview.vue'),
    },
  ],
})
