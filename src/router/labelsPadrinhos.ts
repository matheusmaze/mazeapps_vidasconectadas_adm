const List = [
  {
    icon: "home",
    label: "Dashboard",
    name: "Home",
    path: "/",
    component: () => import("../views/Padrinhos/Dashboard/index.vue"),
  },

   // Doadores
   {
    icon: "user",
    label: "Doadores",
    name: "Doadores",
    path: "/doadores",
    component: () => import("../views/Padrinhos/Doadores/index.vue"),
  },

  {
    show: false,
    name: "Doadores-Criar",
    path: "/doadores/criar",
    component: () => import("../views/Padrinhos/Doadores/create.vue"),
  },

  {
    show: false,
    name: "Doadores-Detalhes",
    path: "/doadores/detalhes/:id?",
    component: () => import("../views/Padrinhos/Doadores/DoadoresId/index.vue"),
  },

  {
    show: false,
    name: "Doadores-Detalhes-criar",
    path: "/doadores/detalhes/:id?/criar",
    component: () => import("../views/Padrinhos/Doadores/DoadoresId/create.vue"),
  },

  {
    show: false,
    name: "Doadores-Detalhes-editar",
    path: "/doadores/detalhes/:id?/editar/:id?",
    component: () => import("../views/Padrinhos/Doadores/DoadoresId/update.vue"),
  },

  //Doações
  {
    icon: "card-hearts",
    label: "Minhas doações",
    name: "Doações",
    path: "/doacoes",
    component: () => import("../views/Padrinhos/Doacoes/index.vue"),
  },

  {
    show: false,
    name: "Doações-Criar",
    path: "/doacoes/criar",
    component: () => import("../views/Padrinhos/Doacoes/create.vue"),
  },

  {
    show: false,
    name: "Doações-Editar",
    path: "/doacoes/editar/:id?",
    component: () => import("../views/Padrinhos/Doacoes/update.vue"),
  }
];

export default List;
