<template>
  <div class="grid overflow-x-hidden bg-gray-50">
    <div class="sidebar">
      <Sidebar />
    </div>

    <div class="main p-8 w-full mx-auto">
      <router-view />
    </div>
    <div class="navbar">
      <Navbar />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Sidebar from "../components/Elements/Sidebar.vue";
import Navbar from "../components/Elements/Navbar.vue";
export default defineComponent({
  name: "App",
  components: {
    Sidebar,
     Navbar,
  },
});
</script>
<style lang="scss" scoped>
.grid {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 16rem 1fr;
  grid-template-rows: 4rem 1fr;
}

@media only screen and (max-width: 600px) {
  .grid {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 4rem 1fr;
  }
}

.sidebar {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
}

.navbar {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}

.main {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
}
</style>

