<template>
  <div class="mt-6 mb-8">
    <h3 class="font-bold text-primary">Lista de Instituições</h3>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados às instituições como
      suas respectivas ações.
    </span>
  </div>
  <div class="flex mb-6 justify-end w-full">
    <router-link :to="`${route.path}/criar`">
      <Button
        color="primary"
        :text="`Criar Instituição`"
      />
    </router-link>
  </div>
  <div class="card">
    <DataTable
      :headers="headers"
      :data="data"
      :options="options"
      color="primary"
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
  name: "institutions",
  components: {
    DataTable,
    Button,
  },
  setup() {
    const headers = [
      { key: "ID", value: "id"},
      { key: "Nome", value: "name"},
      { key: "CNPJ", value: "cnpj", cnpj: true},
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
        data.value = await GET("institutions");
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
      const deleteFunction = async function() {
        try {
          loader.open();
          await DELETE(`institutions/${user.id}`);
          data.value = data.value.filter((item) => item.id != user.id);
          loader.close();
          alert.open(
            "Sucesso!",
            `Instituição deletada com sucesso!`,
            "success"
          );
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
        message: "Deseja realmente excluir essa instituição?",
        confirmMessage: "Sim",
        callbackOK: () => deleteFunction(),
        callbackCancel: () => cancelFunction(),
      });
      loader.close();
    };

    const show = (r) => {
      router.push(`${route.path}/editar/${r.id}`);
    };

    const options = [
      { icon: "pen", action: (param) => show(param), title: 'Editar instituição' },
      { icon: "trash", action: (param) => deleteItem(param), title: 'Excluir instituição' },
    ];

    return { headers, data, options, route };
  },
};
</script>

<style>
</style>
