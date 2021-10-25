<template>
  <div class="w-full mt-6 mb-8">
    <h3 class="font-bold text-primary">Lista de {{ route.name.split('/')[1] }}</h3>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados aos {{route.name.split('/')[1].toLowerCase()}} como
      suas respectivas ações.
    </span>
  </div>
  <div class="flex mb-6 justify-end w-full">
    <router-link :to="`${route.path}/criar`">
      <Button
        :text="`Criar ${(route.name.split('/')[1].substring(0, route.name.split('/')[1].length - 2)).toLowerCase()}`"
      />
    </router-link>
  </div>
  <div class="card">
    <DataTable
      :headers="headers"
      :data="data"
      :options="options"
      :exports="true"
      color="primary"
    />
  </div>
</template>

<script>
import Button from "../../../components/Elements/Button.vue";
import DataTable from "../../../components/Elements/Datatable.vue";
import { inject, onMounted, ref } from "vue";
import { GET, DELETE } from "../../../services/api";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "users",
  components: {
    Button,
    DataTable,
  },
  setup() {
    const headers = [
      { key: "ID", value: "id"},
      { key: "Nível", value: "nivel"},
      { key: "Nome", value: "name"},
      { key: "Documento", value: "document", document: true},
      { key: "Contato", value: "email"},
      { key: "Opções", value: ""},
    ];


    const route = useRoute();
    const router = useRouter();
    const modal = inject("modal");
    const alert = inject("alert");
    const loader = inject("loading");

    const data = ref([]);

    onMounted(async () => {
      try {
        loader.open();
        data.value = await GET("users");
        data.value.map( user => user.nivel = user.nivel[0] + user.nivel.substring(1).toLowerCase());
        loader.close();
      } catch (e) {
        loader.close();
        if(e.includes("Token")) {
          alert.open("Atenção!", e, "danger");
          localStorage.removeItem('token');
          localStorage.removeItem('info');
          router.push('/login');
        } else {
          alert.open("Atenção!", e, "danger");
        }
      }
    });

    const deleteItem = (user) => {
      const deleteFunction = async function () {
        loader.open();
        try {
          await DELETE(`users/${user.id}`);
          data.value = data.value.filter((item) => item.id != user.id);
          loader.close();
          alert.open("Sucesso!", `Doador <b>${user.name}</b> deletado com sucesso!`, "success");
        } catch (e) {
          loader.close();
          alert.open("Erro", e, "danger");
        }
      };

      const cancelFunction = () => {
        modal.close()
      }
     
      modal.open({
        title: "Atenção",
        message: "Deseja realmente excluir esse doador?",
        confirmMessage: "Confirmar",
        callbackOK: () => deleteFunction(),
        callbackCancel: () => cancelFunction(),
      })


      loader.close();
    };

    const push = (r) => {
      window.open(`/${route.name.toLowerCase()}/detalhes/${r.id}`);
    };

    const options = [
      { icon: "pen", action: (param) => push(param), title: 'Detalhes do doador' },
      { icon: "trash", action: (param) => deleteItem(param), title: 'Excluir doador' },
    ];

    return { headers, options, route, data };
  },
};
</script>

<style>
</style>