<template>
  <button v-if="type === 'mobile'"
    type="button"
    :class="`bg-ternary
    text-white
    btn-outline-primary 
    transition duration-300 ease-in-out
    focus:outline-none focus:shadow-outline
    font-bold py-4 w-full px-4 text-base rounded-md flex items-center justify-center`"
  >
    {{text}} 
  </button>
  <button v-else
    type="button"
    :class="`bg-ternary
    text-white
    btn-outline-primary 
    transition duration-300 ease-in-out
    focus:outline-none focus:shadow-outline
    font-bold py-2 w-5/4 px-4 text-sm rounded-md flex items-center justify-center`"
  >
    {{text}} 
  </button>
</template>

<script>
export default {
    props:{
        text: String || null,
        type: String || null,
    },
    setup(props){
        return {props}
    }
};
</script>

<style>
</style>