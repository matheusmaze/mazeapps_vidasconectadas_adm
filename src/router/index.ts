import { createRouter, createWebHistory } from 'vue-router';
import LabelsAdm from './labelsAdm';
import LabelsComprador from './labelsComprador';
import LabelsPadrinhos from './labelsPadrinhos';
import store from '../../store/index';
import Base from '../views/Base.vue';


const routes: Array<any> = [
  { name: "Login", path: '/login',  component: () => import('../views/Login.vue')},
  { name: "Redefinir senha", path: '/redefinir-senha',  component: () => import('../views/RedefinirSenha.vue')},
  {
    name: 'Adm',
    path: '/adm',
    component: Base,
    children: LabelsAdm,
  },
  {
    name: 'Comprador',
    path: '/comprador',
    component: Base,
    children: LabelsComprador,
  },
  {
    name: 'Padrinhos',
    path: '/',
    component: Base,
    children: LabelsPadrinhos,
  }
]


const router = createRouter({

  history: createWebHistory(process.env.BASE_URL ? process.env.BASE_URL : ''),
  routes
})

router.beforeEach((to, from, next) => {
      store.commit('changeName', to.name);
      if(!localStorage.getItem("info_vidas") && !localStorage.getItem("t_vidas") && to.name != "Login")
        router.push({ path: '/login' });
      next();
});

export default router
