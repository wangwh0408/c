import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/my-models'
  },
  {
    path: '/my-models',
    name: 'MyModels',
    component: () => import('@/views/MyModels.vue')
  },
  {
    path: '/model-training',
    name: 'ModelTraining',
    component: () => import('@/views/ModelTraining.vue')
  },
  {
    path: '/model-testing',
    name: 'ModelTesting',
    component: () => import('@/views/ModelTesting.vue')
  },
  {
    path: '/data-management',
    name: 'DataManagement',
    component: () => import('@/views/DataManagement.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
