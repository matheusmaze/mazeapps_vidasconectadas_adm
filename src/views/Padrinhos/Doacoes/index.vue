<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">Minhas Doações</h3>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados às doações como
      suas respectivas ações.
    </span>
  </div>

  <div class="flex justify-end mt-5">
      <router-link :to="`${route.path}/criar`">
        <Button color="primary" :text="`Criar Doação`" />
      </router-link>
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
import Button from "../../../components/Elements/Button.vue";
import { inject, onMounted, ref } from "vue";
import { GET, DELETE } from "../../../services/api";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "users",
  components: {
    DataTable,
    Button, 
  },
  setup() {
    const headers = [
      { key: "ID", value: "id" },
      { key: "Data", value: "created_at", date: true },
      { key: "Valor", value: "fixed_value", money: true },
      { key: "Tipo", value: "recurrence_interval"},
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
    const status = ref([]);
    const info = JSON.parse(localStorage.getItem("info_vidas"));

    onMounted(async () => {
      try {
        loader.open();
        data.value = await GET(`donations/users/${info.id}`);
        data.value.map((donation) => {
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
          data.value = await GET(`donations/users/${info.id}`);
          data.value.map((donation) => {
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
      window.open(`/doacoes/editar/${donation.id}`);
    };

    // const push = (r) => {
    //   window.open(`/adm/doadores/detalhes/${r.users_id}`);
    // };

    const options = [
      // { icon: "user", action: (param) => push(param), title: 'Detalhes do doador' },
      { icon: "pen", action: (param) => show(param), title: 'Editar doação' },
      { icon: "trash", action: (param) => deleteItem(param), title: 'Desativar doação' },
    ];

    return {
      headers,
      data,
      options,
      route,
      status,
    };
  },
};
</script>

<style>
</style>
