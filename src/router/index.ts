import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Maze from '@/views/Maze.vue';
import Way from '@/views/Way.vue';
import C4 from '@/views/C4.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/maze',
    component: Maze,
  },
  {
    path: '/way',
    component: Way,
  },
  {
    path: '/c4',
    component: C4,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
