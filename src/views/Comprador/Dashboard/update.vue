<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">
      Editar compra
    </h3>
    <span class="text-sm text-gray-500"
    >Preencha as informações abaixo e clique no botão <b>salvar compra</b> para confirmar a edição do item!
    </span>
  </div>

  <div class="shadow-sm bg-white border p-8">
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="inline-block flex-1 my-3" v-if="data.status === 'Aguardando'">
        <Input
          v-model="data.institutions_id"
          type="select"
          label="Instituição"
          placeholder="Selecione um item"
          :data="institutionsName"
        />
      </div>
      <div class="inline-block flex-1 my-3" v-else>
        <Input
          v-model="data.institutionName"
          type="default"
          label="Instituição"
          readonly
        />
      </div>

      <div class="inline-block flex-1 my-3" v-if="data.status === 'Aguardando'">
        <Input
          v-model="data.value"
          type="money"
          label="Valor da compra"
          placeholder="Valor"
        />
      </div>
      <div class="inline-block flex-1 my-3" v-else>
        <Input
          v-model="data.value"
          type="default"
          label="Valor da compra"
          readonly
        />
      </div>

      <div class="inline-block flex-1 my-3" v-if="data.status === 'Aguardando'">
        <Input
          v-model="data.created_at"
          type="date"
          :showTip="false"
          placeholder="XX/XX/XXXX"
          label="Data da compra"
        />
      </div>
      <div class="inline-block flex-1 my-3" v-else>
        <Input
          v-model="data.created_at"
          type="date"
          :showTip="false"
          label="Data da compra"
          readonly
        />
      </div>
    </span>
    <span class="lg:inline-grid w-full grid-cols-1 gap-x-4">
      <Input v-if="data.status === 'Aguardando'"
        v-model="data.description"
        type="textarea"
        label="Descrição do que foi comprado"
        placeholder="Insira aqui os detalhes da compra realizada."
      />
      <Input v-else
        v-model="data.description"
        type="textarea"
        label="Descrição do que foi comprado"
        readonly
      />
    </span>
    <span class="lg:inline-grid w-full grid-cols-2 gap-x-4">
      <div class="inline-block w-5/6 flex-1 m-3 ml-0" v-if="data.status === 'Aguardando'">
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
      <div class="inline-block flex-1 my-3" v-else>
        <Input
          v-model="data.purchase_voucher"
          type="image"
          label="Anexar comprovante"
          readonly
        />
      </div>

      <div class="inline-block flex-1 my-3">
        <Input
          v-model="data.status"
          type="default"
          label="Status da compra"
          readonly
        />
      </div>
    </span>
  </div>
  <div class="flex justify-end mt-5" v-if="data.status === 'Aguardando'">
    <Button @click="update" color="primary" :text="`Salvar compra`" />
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
    const modal = inject("modal");
    const route = useRoute();
    //DATA
    const data = ref({});
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

    const index = async () => {
        loader.open();
        const response = await GET(`buys/${route.params.id}`);
        response.value = response.value.replace('.', ',');
        institutions.value = await GET("institutions");
        institutions.value.map(institution => {
          institutionsName.value.push({label: institution.name, value: institution.id});
          institution.id === response.institutions_id && (response.institutionName = institution.name);
        });
        loader.close();
        return {
          description: response.description,
          value: 'R$ '+response.value,
          'purchase_voucher': response.purchase_voucher,
          'created_at': (response.created_at) ? response.created_at.substring(0, 10) : response.created_at,
          'users_id': response.users_id,
          'institutions_id': response.institutions_id,
          institutionName: response.institutionName,
          status: response.status
        };
    };

    const update = async () => {
      const handle = async () => {
        const validate = isEmpty(data.value);
        if (validate) {
          alert.open("Atenção!", validate, "warning");
        } else if (data.value.value.includes('R$') && (data.value.value.split(' ')[1] === '' || data.value.value.split(' ')[1] === undefined || parseInt(data.value.value.split(' ')[1]) === 0)) {
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

              if (item[key])
              objRequest.append(key, item[key]);
            }
            await POST(`buys/${route.params.id}`, objRequest);
            alert.open(
                "Sucesso!",
                `Compra editada com sucesso!`,
                "success"
            );
            loader.close();
            router.push(`/comprador`);
        } catch (e) {
          data.value['users_id'] = null;
          alert.open("Atenção!", e, "danger");
          loader.close();
        }
        }
      };

      const cancelFunction = () => {
        modal.close()
      }

      modal.open({
        title: "Atenção",
        message: "Deseja realmente editar essa compra?",
        confirmMessage: "Sim",
        callbackOK: () => handle(),
        callbackCancel: () => cancelFunction(),
      });
    };

    onMounted(async () => {
      try {
        data.value = await index();
        console.log(data.value)
      } catch(e) {
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
        status: data.value.status,
        value: data.value.value,
        description: data.value.description,
        'purchase_voucher': event.target.files[0],
        'created_at': data.value.created_at,
        'users_id': data.value.users_id,
        'institutions_id': data.value.institutions_id,
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
      update,
      route,
      defaultLabel,
      usersName,
      institutionsName,
      status,
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