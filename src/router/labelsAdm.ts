const List = [
  {
    icon: "home",
    label: "Dashboard",
    name: "Adm/Home",
    path: "/adm",
    component: () => import("../views/Adm/Dashboard/index.vue"),
  },

   // Doadores
  {
    icon: "user",
    label: "Doadores",
    name: "Adm/Doadores",
    path: "/adm/doadores",
    component: () => import("../views/Adm/Padrinhos/index.vue"),
  },

  { 
    show: false,
    name: "Adm/Doadores/Criar", 
    path: "/adm/doadores/criar", 
    component: () => import('../views/Adm/Padrinhos/create.vue') 
  },

  {
    show: false,
    name: "Adm/Doadores/Detalhes",
    path: "/adm/doadores/detalhes/:id?",
    component: () => import("../views/Adm/Padrinhos/PadrinhoId/index.vue"),
  },

  {
    show: false,
    name: "Adm/Doadores/Detalhes/Criar",
    path: "/adm/doadores/detalhes/:id?/criar",
    component: () => import("../views/Adm/Padrinhos/PadrinhoId/create.vue"),
  },

  {
    show: false,
    name: "Adm/Doadores/Detalhes/Editar",
    path: "/adm/doadores/detalhes/:id?/editar/:id?",
    component: () => import("../views/Adm/Padrinhos/PadrinhoId/update.vue"),
  },

  //Doações
  {
    icon: "card-hearts",
    label: "Doações",
    name: "Adm/Doações",
    path: "/adm/doacoes",
    component: () => import("../views/Adm/Doacoes/index.vue"),
  },

  //Instituições
  {
    icon: "briefcase",
    label: "Instituições",
    name: "Adm/Instituições",
    path: "/adm/instituicoes",
    component: () => import("../views/Adm/Instituicoes/index.vue")
  },

  {
    show: false,
    name: "Adm/Instituicoes/Criar",
    path: "/adm/instituicoes/criar",
    component: () => import("../views/Adm/Instituicoes/create.vue")
  },

  { 
    show: false,
    name: "Adm/Instituicoes/Editar", 
    path: "/adm/instituicoes/editar/:id?", 
    component: () => import('../views/Adm/Instituicoes/update.vue') 
  },

  //compras
  {
    icon: "dollar",
    label: "Compras",
    name: "Adm/Compras",
    path: "/adm/compras",
    component: () => import("../views/Adm/Compras/index.vue")
  },

  {
    show: false,
    name: "Adm/Compras/Criar",
    path: "/adm/compras/criar",
    component: () => import("../views/Adm/Compras/create.vue")
  },

  {
    show: false,
    name: "Adm/Compras/Editar",
    path: "/adm/compras/editar/:id?",
    component: () => import("../views/Adm/Compras/update.vue")
  },


]

export default List;
