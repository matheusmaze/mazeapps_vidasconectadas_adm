<template>
  <div :class="`w-full  ${store.getters.loading ? 'block' : 'hidden'} h-full absolute 
  flex justify-center items-center 
  bg-black opacity-70 z-50`">
      <img class="w-20 select-none" src='../../assets/images/loader.gif'/>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'loading',
  setup(){
    const store = useStore()
    return { store }
  }
}
</script>

<style>

</style>