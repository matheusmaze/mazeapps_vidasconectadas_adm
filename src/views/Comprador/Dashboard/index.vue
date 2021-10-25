<template>
  <div class="home w-full mt-6 mb-8">
    <h2 class="font-bold dark:text-gray-200 text-primary">
      Suas compras
    </h2>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados às suas compras.
    </span>
  </div>
  <div class="flex mb-6 justify-end w-full">
    <router-link :to="`${route.path}/criar`">
      <Button
        :text="`Criar compra`"
      />
    </router-link>
  </div>
  <div class="flex flex-row my-12 items-baseline justify-start">
    <div class="w-56 mr-3">
      <Input
        v-model="filtro"
        type="select"
        label="Status da compra"
        :data="[
          { label: 'Todas', value: 'todas' },
          { label: 'Aprovada', value: 'Aprovada' },
          { label: 'Reprovada', value: 'Reprovada' },
          { label: 'Aguardando', value: 'Aguardando' },
        ]"
      />
    </div>
    <div class="w-56">
      <Button @click="filterAll" color="primary" text="Filtrar" class="w-24 h-14" />
    </div>
  </div>
  <DataTable
    :headers="headers"
    :data="buys"
    :options="options"
    color="primary"
  />
</template>

<script>
import { defineComponent, inject, onMounted, ref, watch } from "vue";
import DataTable from "../../../components/Elements/Datatable.vue";
import Button from "../../../components/Elements/Button.vue";
import Input from "../../../components/Elements/Input.vue";
import { GET, DELETE } from "../../../services/api";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Home",
  components: {
    Input,
    DataTable,
    Button
  },

  setup() {
    const headers = [
      { key: "ID", value: "id"},
      { key: "Instituições", value: "institutionName"},
      { key: "Valor", value: "value", money: true},
      { key: "Data", value: "created_at", date: true},
      { 
        key: "Status", 
        value: "status", 
        badge: { 
          "Aprovada": "green", 
          "Reprovada": "red",
          "Aguardando": "yellow",
        } 
      },
      { key: "Opções", value: ""},
    ];

    const modal = inject("modal");
    const alert = inject("alert");
    const loader = inject("loading");
    const users = ref([]);
    const route = useRoute();
    const router = useRouter();
    const data = ref([]);
    const buys = ref([]);
    const institutions = ref([]); 
    const filtro = ref('todas');
    const options = ref([]);

    const filterAll = async () => {
      loader.open();
      filtro.value === 'todas' 
        ? buys.value = data.value
        : buys.value = data.value.filter( buy => filtro.value === buy.status);
      buys.value.forEach( (buy, index) => {
        institutions.value.forEach( institution => {
          if(buy.institutions_id === institution.id){
            buys.value[index].institutionName = institution.name;
          }
        });
      });
      loader.close();
    };

    onMounted(async () => {
      loader.open();
      try {
        const info = JSON.parse(localStorage.getItem("info_vidas"));
        data.value = await GET(`buys/users/${info.id}`);
        buys.value = data.value;
        institutions.value = await GET("institutions");
        buys.value.forEach( (buy, index) => {
          institutions.value.forEach( institution => {
            if(buy.institutions_id === institution.id){
              buys.value[index].institutionName = institution.name;
            }
          });
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

    const deleteItem = (buy) => {
      loader.open();
      const deleteFunction = async function () {
        try {
          loader.open();
          await DELETE(`buys/${buy.id}`);
          buys.value = buys.value.filter((item) => item.id != buy.id);
          data.value = data.value.filter((item) => item.id != buy.id);
          loader.close();
          alert.open("Sucesso!", `Compra deletada com sucesso!`, "success");
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
        message: "Deseja realmente excluir esse item?",
        confirmMessage: "Confirmar",
        callbackOK: () => deleteFunction(),
        callbackCancel: () => cancelFunction(),
      })

      loader.close();
    };

    const show = (r) => {
      router.push(`/comprador/editar/${r.id}`);
    };

    options.value = [
      { icon: "pen", action: (param) => show(param), route: 'comprador', title: 'Editar compra' },
      { icon: "trash", action: (param) => deleteItem(param), route: 'comprador', title: 'Excluir compra' },
    ];

    return {
      data,
      buys,
      headers,
      options,
      users,
      status,
      route,
      filtro,
      filterAll
    };
  },
});
</script>

<style scoped>
  .title{
    border-bottom: 2.5px solid #9EADBA;
    padding-bottom: 2rem;
  }

  .container{
    display: flex;
    flex-flow: row wrap;
  }

  @media only screen and (min-width: 950px) {
    .container{
      flex-flow: row nowrap;
    }
  }
</style>
