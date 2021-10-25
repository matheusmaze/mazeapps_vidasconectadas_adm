const List = [
  {
    icon: "home",
    label: "Dashboard",
    name: "Comprador/Home",
    path: "/comprador",
    component: () => import("../views/Comprador/Dashboard/index.vue"),
  },
  {
    show: false,
    name: "Comprador/Home/Criar",
    path: "/comprador/criar",
    component: () => import("../views/Comprador/Dashboard/create.vue"),
  },
  {
    show: false,
    name: "Comprador/Home/Editar",
    path: "/comprador/editar/:id?",
    component: () => import("../views/Comprador/Dashboard/update.vue"),
  }
];

export default List;
