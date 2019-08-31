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
      path: '/events/:id/competitors',
      name: 'competitors',
      component: () => import('./views/Competitors.vue'),
    },
    {
      path: '/events/:eventId/competitors/create',
      name: 'create-competitor',
      component: () => import('./views/CompetitorForm.vue'),
    },
    {
      path: '/events/:eventId/competitors/:competitorId/edit',
      name: 'edit-competitor',
      component: () => import('./views/CompetitorForm.vue'),
    },
    {
      path: '/events/:id/courses',
      name: 'courses',
      component: () => import('./views/Courses.vue'),
    },
    {
      path: '/events/:eventId/courses/create',
      name: 'create-course',
      component: () => import('./views/CourseForm.vue'),
    },
    {
      path: '/events/:eventId/courses/:courseId/edit',
      name: 'edit-course',
      component: () => import('./views/CourseForm.vue'),
    },
    {
      path: '/events/:id',
      name: 'event-overview',
      component: () => import('./views/EventOverview.vue'),
    },
    {
      path: '/events/:id/download',
      name: 'download',
      component: () => import('./views/Download.vue'),
    },
  ],
})
