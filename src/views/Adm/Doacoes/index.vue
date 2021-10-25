<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">Lista de Doações</h3>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados às doações como
      suas respectivas ações.
    </span>
  </div>

  <div class="card my-8">
    <DataTable
      :headers="headers"
      :data="data"
      :options="options"
      color="primary"
      :exports="true"
    />
  </div>
</template>

<script>
import DataTable from "../../../components/Elements/Datatable.vue";
import { inject, onMounted, ref } from "vue";
import { GET, DELETE } from "../../../services/api";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "users",
  components: {
    DataTable,
  },
  setup() {
    const headers = [
      { key: "ID", value: "id" },
      { key: "Doador", value: "username" },
      { key: "Documento", value: "document", document: true },
      { key: "Data", value: "created_at", date: true },
      { key: "Valor", value: "fixed_value", money: true },
      { 
        key: "Status", 
        value: "status", 
        badge: { 
          "Ativa": "green", 
          "Inativa": "red",
        } 
      },
      { key: "Opções", value: "" },
    ];

    const route = useRoute();
    const router = useRouter();
    const modal = inject("modal");
    const alert = inject("alert");
    const loader = inject("loading");
    const data = ref([]);
    const totalInfos = ref([]);
    const status = ref([]);
    const filtro = ref({
      ["orders_status_id"]: "1",
      ["initial_date"]: "",
      ["final_date"]: "",
    });

    onMounted(async () => {
      try {
        loader.open();
        data.value = await GET("donations");
        data.value.map((donation) => {
            if (donation.users) {
              donation.username = donation.users.name
              donation.document = donation.users.document
            }

            donation.status === 'ACTIVE' ? donation.status = 'Ativa' : donation.status = 'Inativa';
        });
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

    const deleteItem = (donation) => {
      const deleteFunction = async function() {
        loader.open();
        try {
          await DELETE(`donations/${donation.id}`);
          data.value = await GET("donations");
          data.value.map((donation) => {
              if (donation.users) {
                donation.username = donation.users.name
                donation.document = donation.users.document
              }

              donation.status === 'ACTIVE' ? donation.status = 'Ativa' : donation.status = 'Inativa';
          });
          loader.close();
          alert.open("Sucesso!", `Doação desativada com sucesso!`, "success");
        } catch (e) {
          loader.close();
          alert.open("Erro", e, "danger");
        }
      };

      const cancelFunction = () => {
        modal.close();
      };

      modal.open({
        title: "Atenção",
        message: "Deseja realmente desativar essa doação?",
        confirmMessage: "Sim",
        callbackOK: () => deleteFunction(),
        callbackCancel: () => cancelFunction(),
      });

      loader.close();
    };

    const show = (donation) => {
      window.open(`/adm/doadores/detalhes/${donation['users_id']}/editar/${donation.id}`);
    };

    const push = (r) => {
      window.open(`/adm/doadores/detalhes/${r.users_id}`);
    };

    const options = [
      { icon: "user", action: (param) => push(param), title: 'Detalhes do doador' },
      { icon: "pen", action: (param) => show(param), title: 'Detalhes da doação' },
      { icon: "trash", action: (param) => deleteItem(param), title: 'Desativar doação' },
    ];

    return {
      headers,
      data,
      options,
      route,
      status,
      totalInfos,
      filtro,
    };
  },
};
</script>

<style>
</style>
