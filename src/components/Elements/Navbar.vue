<template>
      <div class="flex flex-col w-full bg-white b">
        <header class="z-10 py-4 flex justify-end px-5 shadow">

          <div v-if="$store.state.name.split('/')[1]"
            class="container flex items-center mt-2 font-bold justify-start h-full px-6 text-sm  text-primary dark:text-purple-300"
          >
           <button @click="router.back()" class="relative text-sm text-primary align-middle rounded-md focus:outline-none focus:shadow-outline-purple mr-4" aria-label="Notifications" aria-haspopup="true">
                  <i class="gg-arrow-left"></i>
                </button>
            {{$store.state.name.split('/').splice(1).join(' > ')}}
          </div>
          <div v-else
            class="container flex items-center mt-2 font-bold justify-start h-full px-6 text-sm  text-primary dark:text-purple-300"
          >
           <button @click="router.back()" class="relative text-sm text-primary align-middle rounded-md focus:outline-none focus:shadow-outline-purple mr-4" aria-label="Notifications" aria-haspopup="true">
                  <i class="gg-arrow-left"></i>
                </button>
            {{$store.state.name.split('-').join(' > ')}}
          </div>

          <p class="text-sm mr-5 mt-2 text-gray-500">{{info.email}}</p>
          <!-- <button @click="logout" class="relative text-sm hover:text-primary align-middle focus:outline-none focus:shadow-outline-purple mr-4" aria-label="Notifications" aria-haspopup="true">
            <i class="gg-arrow-right-r "></i>
            <div class="button py-2 px-4 rounded">Sair</div>
          </button> -->
          <Button 
            @click="logout"
            :text="`Sair`"
          />
    </header>
      </div>
</template>

<script>
import { onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { instance } from "../../services/api";
import Button from '../Elements/Button.vue';

export default {
    name:'Navbar',
    components: {
      Button,
    },
    setup(){
      const router = useRouter()
      const info = ref({})
      const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('info')
        instance.defaults.headers.Authorization = '';
        router.push('/login');
      }
      onMounted(() => {
        info.value = JSON.parse(localStorage.getItem("info_vidas"));
      })
      return { logout, router, info }
    }
    
}
</script>

<style>
</style>