<template>
  <div
    :class="`bg-${store.getters.alert.type == 'danger' ? 'red' : store.getters.alert.type == 'success' ? 'green' : 'yellow'}-100 transform 
    transition-all duration-150 ease-out 
    ${store.getters.alert.display ? 'scale-1' : 'scale-0'} fixed right-10 bottom-10 border-t-4 
    border-${store.getters.alert.type == 'danger' ? 'red' : store.getters.alert.type == 'success' ? 'green' : 'yellow'}-500 rounded-b text-gray-700 
    w-1/4 py-3 shadow-md z-50`"
    role="alert"
    id="alert"
    ref="alert"
  >
    <div class="flex">
      <div class="py-1">
   
      </div>
      <div class="w-full px-4">
        <p class="font-bold flex justify-between">
         {{store.getters.alert.title}} <i @click="close" class="gg-close cursor-pointer"></i>
        </p>
        <p class="text-sm" v-html="store.getters.alert.message"> </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: "AlertBox",
  setup() {
    const store = useStore()
    const close = () => {
        store.commit('alert', {display: false})
    }

    return { close, store }
  },
});
</script>

<style>
</style>