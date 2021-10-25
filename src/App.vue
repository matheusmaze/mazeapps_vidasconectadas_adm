<template>
  <div class="font-sans">
    <modal />
    <loading />
    <alertbox />
    <router-view />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

import Loading from './components/Loading/index'
import AlertBox from './components/Elements/AlertBox'
import Modal from './components/Elements/Modal'


export default {
  name: 'App',
  components:{
    'alertbox': AlertBox,
    'loading': Loading,
    'modal': Modal,
  },
  setup(){
      const router = useRouter();
      const isAuth = localStorage.getItem('t_vidas') ? true : false
      if(!isAuth){
        router.push({ path: '/login' })
      }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>