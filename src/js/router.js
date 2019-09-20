import VueRouter from 'vue-router'

import SSO from './pages/sso.vue'

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "page-index" */ './pages/index.vue'),
    name: 'root',
  },
  {
    path: '/category/:category',
    component: () => import(/* webpackChunkName: "page-category" */ './pages/category.vue'),
    name: 'category',
  },
  {
    path: '/achievements',
    component: () => import(/* webpackChunkName: "page-achievements" */ './pages/achievements.vue'),
    name: 'achievements',
  },
  {
    path: '/track/',
    component: SSO,
    name: 'sso',
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
