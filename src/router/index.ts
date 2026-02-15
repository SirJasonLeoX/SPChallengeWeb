import { createRouter, createWebHistory } from 'vue-router';
import ConfigPage from '@/pages/ConfigPage.vue';
import GamePage from '@/pages/GamePage.vue';
import VictoryPage from '@/pages/VictoryPage.vue';

const routes = [
  {
    path: '/',
    name: 'config',
    component: ConfigPage,
    meta: { title: 'SP惩罚大挑战 - 配置' }
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage,
    meta: { title: 'SP惩罚大挑战 - 游戏中' }
  },
  {
    path: '/victory',
    name: 'victory',
    component: VictoryPage,
    meta: { title: 'SP惩罚大挑战 - 胜利' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'SP惩罚大挑战';
  next();
});

export default router;