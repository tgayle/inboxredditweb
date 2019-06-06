import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '../pages/Welcome.vue';
import AuthenticateUser from '../pages/AuthenticateUser.vue';

import appRoutes from './app';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
    },
    {
      path: '/auth/reddit',
      name: 'authuser',
      component: AuthenticateUser,
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('../pages/MessagingApp.vue'),
      children: appRoutes,
      beforeEnter(to, from, next) {
        if (!to.params.where) {
          return next({
            name: 'app',
            params: {
              where: 'inbox',
            },
          });
        }
        next();
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
  ],
});
