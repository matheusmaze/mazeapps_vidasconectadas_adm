import { createApp } from 'vue'
import { io } from 'socket.io-client';
import Maska from 'maska'
import App from './App.vue'
import router from './router'
import store from '../store/index'
import alert from './services/alert'
import modal from './services/modal'
import loading from './services/loading'
import './assets/styles/index.css'
import './assets/styles/icons.css'


const app = createApp(App);
// const socket = io('https://socket-notification-oasis.herokuapp.com/');


app
.use(Maska)
.use(store)
.use(router)
.provide('alert', alert)
.provide('loading', loading)
.provide('modal', modal)
// .provide('socket', socket)
.mount('#app')
