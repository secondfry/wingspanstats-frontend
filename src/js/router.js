import VueRouter from 'vue-router'

import PageAchievements from './pages/achievements.vue'
import PageIndex from './pages/index.vue'
import PageCategory from './pages/category.vue'

const routes = [
  {
    path: '/',
    component: PageIndex,
    name: 'root',
  },
  {
    path: '/category/:category',
    component: PageCategory,
    name: 'category',
  },
  {
    path: '/achievements',
    component: PageAchievements,
    name: 'achievements',
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
