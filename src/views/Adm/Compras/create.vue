<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">
      Cadastrar {{ route.name.split("/")[1].slice(0, -1).toLowerCase() }}
    </h3>
  </div>

  <div class="shadow-sm bg-white border p-8">
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="inline-block flex-1 my-3">
        <Input
          v-model="data.institutions_id"
          type="select"
          label="Instituição"
          placeholder="Selecione um item"
          :data="institutionsName"
        />
      </div>
      <div class="inline-block flex-1 my-3">
        <Input
          v-model="data.value"
          type="money"
          label="Valor da compra"
          placeholder="Valor"
        />
      </div>
      <div class="inline-block flex-1 my-3">
        <Input
          v-model="data.created_at"
          type="date"
          :showTip="false"
          placeholder="XX/XX/XXXX"
          label="Data da compra"
        />
      </div>
    </span>
    <span class="lg:inline-grid w-full grid-cols-1 gap-x-4">
      <Input 
        v-model="data.description"
        type="textarea"
        label="Descrição do que foi comprado"
        placeholder="Insira aqui os detalhes da compra realizada."
      />
    </span>
    <span class="lg:inline-grid w-full grid-cols-2 gap-x-4">
      <div class="inline-block w-5/6 flex-1 m-3 ml-0">
        <div class="block relative">
          <img
            class="flex-auto rounded-lg shadow-lg"
            :src="data.purchase_voucher ? readURL(data.purchase_voucher) : 'https://via.placeholder.com/700x300'"
          />
          <button
            class="bg-ternary rounded-md shadow-md transform hover:scale-105 px-5 py-2 absolute flex justify-center items-center font-bold"
            style="bottom: 20px; left: 20px"
          >
            <label class="text-white" for="logo">Adicionar</label> <i class="ml-3 text-white gg-camera"></i>
            <input
            @change="changeImage"
            class="absolute hidden" id="logo" type="file" />

          </button>
        </div>
      </div>
      <div class="inline-block flex-1 my-3">
        <Input
          v-model="data.users_id"
          type="datalist"
          label="Comprador"
          :data="usersName"
        />
      </div>
    </span>
  </div>
  <div class="flex justify-end mt-5">
    <Button @click="create" color="primary" :text="`Cadastrar ${defaultLabel}`" />
  </div>
</template>

<script>
import Input from "../../../components/Elements/Input.vue";
import Button from "../../../components/Elements/Button.vue";
import { inject, onMounted, ref } from "vue";
import { GET, POST } from "../../../services/api";
import { isEmpty } from "../../../services/validate";
import { useRoute, useRouter } from "vue-router";


export default {
  name: "createUser",
  components: {
    Input,
    Button,
  },

  setup() {

    const loader = inject("loading");
    const alert = inject("alert");
    const router = useRouter();
    const alertProps = inject("alert");
    const route = useRoute();
    //DATA
    const data = ref({
      value: "",
      description: "",
      'purchase_voucher': "",
      'created_at': "",
      'users_id': "",
      'institutions_id': ""
    });
    const users = ref({});
    const usersName = ref([]);
    const institutions = ref({});
    const institutionsName = ref([]);
    //*

    const defaultLabel = ref(
      route.name
        .split("/")[1]
        .slice(0, -1)
        .toLowerCase()
    );

    const create = async () => {
      const validate = isEmpty(data.value);
      if (validate) {
        alert.open("Atenção!", validate, "warning");
      } else if(data.value.value.includes('R$') && (data.value.value.split(' ')[1] === '' || data.value.value.split(' ')[1] === undefined || parseInt(data.value.value.split(' ')[1]) === 0)) {
        alert.open("Atenção!", '*Valor não reconhecido', "warning");
      } else {
        loader.open();
        try {
          const objRequest = new FormData();
          const item = data.value;

          for (const key in item) {
            if(key === 'value'){
              //Retirar o R$
              (item[key].split(' ')[1]) && (item[key] = item[key].split(' ')[1]);
              //eliminar pontos
              if(item[key].length > 6) {
                item[key] = item[key].split('.').join('');
              }
              //Subs , por .
              item[key] = item[key].replace(',', '.');
            }

            if(key === 'users_id'){
              item[key] = usersName.value.find( user => user.label === item[key]).value;
            }

            if (item[key])
              objRequest.append(key, item[key]);
          }
          await POST("buys", objRequest);
          alert.open(
            "Sucesso!",
            `Compra criada com sucesso!`,
            "success"
          );
          loader.close();
          router.push(`/${route.name.split('/').splice(0, 2).join('/').toLowerCase()}`);
        } catch (e) {
          data.value['users_id'] = null;
          alert.open("Atenção!", e, "danger");
          loader.close();
        }
      }
    };

    onMounted( async () => {
      try {
        loader.open();
        users.value = await GET("users");
        users.value.map(user => {
          user.nivel === 'NEGOCIADOR' && usersName.value.push({label: user.name, value: user.id});
        });
        institutions.value = await GET("institutions");
        institutions.value.map(institution => {
          institutionsName.value.push({label: institution.name, value: institution.id});
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

    const changeImage = (event) => {
      const obj = {
        value: data.value.value,
        description: data.value.description,
        'purchase_voucher': event.target.files[0],
        'created_at': data.value.created_at,
        'users_id': data.value.users_id,
        'institutions_id': data.value.institutions_id
      }
      data.value = obj;
    }

    const readURL = file => {
      if(typeof(file) == 'string'){
        return file
      }
      return window.URL.createObjectURL(file)
    };

    return {
      alertProps,
      data,
      create,
      route,
      defaultLabel,
      usersName,
      institutionsName,
      changeImage,
      readURL
    };
  },
};
</script>

<style>
@media screen and (max-width: 1023px){
  .customize{
    width: 179px;
  }
}
</style>