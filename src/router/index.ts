import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Maze from '@/views/Maze.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Maze',
    component: Maze,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
