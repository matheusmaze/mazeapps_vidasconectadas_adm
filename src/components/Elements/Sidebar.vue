<template>
  <div class="relative" style="height: 100vh;">
    <aside
      class="z-20 w-64 sidebar overflow-y-auto fixed h-full bg-white dark:bg-gray-800 flex-shrink-0 shadow-sm"
    >
      <div
        class="dark:text-gray-400 h-full flex flex-col justify-between"
      >
        <div class="list">
          <div
            class="text-lg h-16 logo flex justify-center items-center dark:text-gray-200 mt-4"
            href="#"
          >
            <router-link to="/adm" class="flex justify-center items-center">
              <img
                class="w-2/3 cursor-pointer mt-10"
                src="../../assets/logo.png"
              />
            </router-link>
          </div>
          <template v-if="Labels.length > 0">
            <ul class="mt-20">
              <template v-if="(route.path.includes('/adm') || route.path.includes('/comprador'))">
                <template v-for="(item, index) of Labels" :key="index">
                  <li v-if="item.show !== false" class="relative px-6 py-3 my-2">
                    <span
                      class="absolute inset-y-0 left-0 w-1 bg-ternary rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                      v-if="item.path == route.path"
                    ></span>
                    <a
                      :class="
                        ` inline-flex items-center w-full select-none text-sm text-primary font-semibold transition-colors duration-150 hover:text-ternary ${
                          item.path == `/${route.path.split('/').splice(1, 2).join('/')}` ? 'list__items-active' : ''
                        }`
                      "
                    >
                      <div class="flex items-center justify-between w-full ">
                        <router-link
                          class="flex items-center"
                          :to="{name: item.name}"
                        >
                          <div class="flex w-8 justify-center">
                            <i :class="`gg-${item.icon}`"></i>
                          </div>
                          <span class="ml-4 text-item">{{ item.label }}</span>
                        </router-link>
                      </div>
                    </a>
                  </li>
                </template>
              </template>

              <template v-else>
                <template v-for="(item, index) of Labels" :key="index">
                  <li v-if="item.show !== false" class="relative px-6 py-3 my-2">
                    <span
                      class="absolute inset-y-0 left-0 w-1 bg-ternary rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                      v-if="item.path == route.path"
                    ></span>
                    <a
                      :class="
                        ` inline-flex items-center w-full select-none text-sm text-primary font-semibold transition-colors duration-150 hover:text-ternary ${
                          item.path == `/${route.path.split('/').splice(1, 1).join('/')}` ? 'list__items-active' : ''
                        }`
                      "
                    >
                      <div class="flex items-center justify-between w-full ">
                        <router-link
                          class="flex items-center"
                          :to="{name: item.name}"
                        >
                          <div class="flex w-8 justify-center">
                            <i :class="`gg-${item.icon}`"></i>
                          </div>
                          <span class="ml-4 text-item">{{ item.label }}</span>
                        </router-link>
                      </div>
                    </a>
                  </li>
                </template>
              </template>
            </ul>
          </template>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from "vue-router";
import LabelsAdm from "../../router/labelsAdm";
import LabelsComprador from "../../router/labelsComprador";
import LabelsPadrinhos from "../../router/labelsPadrinhos";
export default {
  name: "Sidebar",
  setup() {
    const route = useRoute();
    const handleSubmenu = (item) => {
      if (
        document
          .getElementById(`list-${item}`)
          .classList.contains("menu-closed")
      ) {
        document.getElementById(`list-${item}`).classList.remove("menu-closed");
        document.getElementById(`list-${item}`).classList.add("menu-open");
        document.getElementById(item).classList.remove("gg-chevron-down");
        document.getElementById(item).classList.add("gg-chevron-up");
      } else {
        document.getElementById(`list-${item}`).classList.remove("menu-open");
        document.getElementById(`list-${item}`).classList.add("menu-closed");
        document.getElementById(item).classList.add("gg-chevron-down");
        document.getElementById(item).classList.remove("gg-chevron-up");
      }
    };
    
    const info = ref({});
    info.value = JSON.parse(localStorage.getItem("info_vidas"));
    //Alterar o Labels de acordo com o id logado
    let Labels = null;
    switch (info.value.nivel) {
      case "MASTER":
        Labels = LabelsAdm;
        break;
      case "NEGOCIADOR":
        Labels = LabelsComprador;
        break;
      case "PADRINHO":
        Labels = LabelsPadrinhos;
        break;
      default:
        break;
    }
    
    return { Labels, route, handleSubmenu, info };
  },
};
</script>

<style scoped>
.list__items-active{
  color: #1C74B4;
}

.gg-dollar {
  margin-left: 5px;
}

.menu-closed {
  display: none;
}

.menu-open {
  display: block;
}

@keyframes showlabels {
  0% {
    margin-top: -20px;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.show-animation {
  animation-name: showlabels;
  animation-duration: 1s;
}

@media only screen and (max-width: 600px) {
  .sidebar {
    position: fixed;
    width: 100vw;
    height: 10vh;
    bottom: 0;
    box-shadow: -5px 0px 20px #7EACD5;
  }

  .menu-open {
    position: fixed;
    background-color: black;
    justify-content: center;
    width: 100vw;
    height: 90vh;
    left: 0;
    top: 0;
  }

  .menu-open div {
    margin-left: 0;
  }

  i:hover {
    color: #372417;
  }
  i {
    color: #372417;
  }

  .logo {
    display: none;
  }

  .list {
    display: flex;
    align-items: center;
  }

  span {
    margin-left: 0;
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active {
    color: white;
  }

  i:hover {
    color: #372417;
  }

  .text-item {
    display: none;
  }

  .sidebar ul {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .menu-open a {
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sidebar img {
    display: none;
  }
}
</style>
