<template>
  <a
    :class="`flex items-center px-6 justify-between p-4 mb-8 text-sm font-semibold
     text-white bg-${color} rounded-lg 
    shadow-md focus:outline-none focus:shadow-outline-purple`"
  >
    <div class="flex items-center ">
      <i :class="`gg-${icon} `"></i>
      <span class="px-5 text-white">{{ label }}</span>
    </div>
  </a>
</template>

<script>
export default {
  name: "Alert",
  props: {
    label: String,
    icon: String,
    color: String,
  },
};
</script>

<style>
</style>