<template>
  <div
    class="md:flex w-56 h-24 border items-center p-4 my-3 mr-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 cursor-pointer"
  >
    <div
      class="rounded-full dark:text-orange-100 dark:bg-orange-500 space-y-4 mx-3 mr-8"
    >
      <i :class="`gg-${icon} text-${color}`"></i>
    </div>
    <div class="w-56">
      <span class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
        {{label}} 
      </span>
      <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{number ? number : 0}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    label: String,
    icon: String,
    color: String,
    number: Number, 
  },
};
</script>

<style>
</style>
