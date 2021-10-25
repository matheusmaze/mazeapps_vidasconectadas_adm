<template>
  <div class="w-full mt-6 mb-8">
    <h3 class="font-bold text-primary">Lista de {{ route.name.split('/')[1] }}</h3>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados às {{route.name.split('/')[1].toLowerCase()}} como
      suas respectivas ações.
    </span>
  </div>
  <div class="flex mb-6 justify-end w-full">
    <router-link :to="`/${route.name.toLowerCase()}/criar`">
      <Button
        :text="`Criar ${(route.name.split('/')[1].substring(0, route.name.split('/')[1].length - 1)).toLowerCase()}`"
      />
    </router-link>
  </div>
  <div class="flex flex-row my-12 items-baseline justify-start">
    <div class="w-56 mr-3">
      <Input
        v-model="filtro"
        type="select"
        label="Status da compra"
        placeholder="Selecione o status"
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
    :exports="true"
    color="primary"
  />
</template>

<script>
import Button from "../../../components/Elements/Button.vue";
import DataTable from "../../../components/Elements/Datatable.vue";
import Input from "../../../components/Elements/Input.vue";
import { inject, onMounted, ref } from "vue";
import { GET, DELETE } from "../../../services/api";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "users",
  components: {
    Input,
    Button,
    DataTable,
  },
  setup() {
    const headers = [
      { key: "ID", value: "id"},
      { key: "Comprador", value: "userName"},
      { key: "Instituições", value: "institutionName"},
      { key: "Valor", value: "value", money: true},
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


    const route = useRoute();
    const router = useRouter();
    const modal = inject("modal");
    const alert = inject("alert");
    const loader = inject("loading");

    const data = ref([]);
    const buys = ref([]);
    const users = ref([]);
    const institutions = ref([]);
    const filtro = ref('');

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
      data.value.forEach( (buy, index) => {
        users.value.forEach( user => {
          if(buy.users_id === user.id){
            data.value[index].userName = user.name;
          }
        });
      });
      loader.close();
    };

    onMounted(async () => {
      try {
        loader.open();
        data.value = await GET("buys");
        buys.value = data.value;
        institutions.value = await GET("institutions");
        buys.value.forEach( (buy, index) => {
          institutions.value.forEach( institution => {
            if(buy.institutions_id === institution.id){
              buys.value[index].institutionName = institution.name;
            }
          });
        });
        users.value = await GET("users");
        buys.value.forEach( (buy, index) => {
          users.value.forEach( user => {
            if(buy.users_id === user.id){
              buys.value[index].userName = user.name;
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
      const deleteFunction = async function () {
        loader.open();
        try {
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
        message: "Deseja realmente excluir essa compra?",
        confirmMessage: "Confirmar",
        callbackOK: () => deleteFunction(),
        callbackCancel: () => cancelFunction(),
      })


      loader.close();
    };

    const show = (r) => {
      router.push(`/${route.name.toLowerCase()}/editar/${r.id}`);
    };

    const options = [
      { icon: "pen", action: (param) => show(param), title: 'Editar compra' },
      { icon: "trash", action: (param) => deleteItem(param), title: 'Excluir compra' },
    ];

    return { headers, options, route, data, filtro, filterAll, buys};
  },
};
</script>

<style>
</style>