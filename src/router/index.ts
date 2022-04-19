import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Maze from '@/views/Maze.vue';
import Way from '@/views/Way.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Maze',
    component: Maze,
  },
  {
    path: '/way',
    name: 'Way',
    component: Way,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
