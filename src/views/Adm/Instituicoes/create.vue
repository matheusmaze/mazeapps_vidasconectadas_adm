<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">
      Criar uma nova instituição
    </h3>
    <span class="text-sm text-gray-500"
      >Preencha as informações abaixo e clique no botão <b>cadastrar</b> para
      confirmar a criação do item!
    </span>
  </div>

  <div class="card shadow-sm border rounded-lg py-8 px-4 bg-white">
    <div class="flex-wrap">
      <div class="inline-block w-1/3 flex-1 m-3">
        <Input
          v-model="data.name"
          type="default"
          label="Nome"
          placeholder="Nome"
        />
      </div>
      <div class="inline-block w-1/3 flex-1 m-3">
        <Input
          v-model="data.cnpj"
          type="cnpj"
          label="CNPJ"
          placeholder="CNPJ"
        />
      </div>
      <div class="inline-block w-1/3 flex-1 m-3">
        <Input
          v-model="data.code"
          type="default"
          label="Código"
          placeholder="Código"
        />
      </div>
      <div class="inline-block w-1/3 flex-1 m-3">
        <Input
          v-model="data.phone_number"
          type="whats"
          label="Telefone"
          placeholder="Telefone"
        />
      </div>
      <div class="w-1/3 flex-1 m-3">
        <Input
          v-model="data.email"
          type="default"
          label="Email"
          placeholder="Email"
        />
      </div>
      <div class="inline-block w-1/3 flex-1 m-3">
        <div class="block relative">
          <img
            class="flex-auto rounded-lg shadow-lg"
            :src="data.logo ? readURL(data.logo) : 'https://via.placeholder.com/700x300'"
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
    </div>
  </div>
  <div class="flex justify-end mt-5">
    <Button @click="create" color="primary" :text="`Cadastrar`" />
  </div>
</template>

<script>
import Input from "../../../components/Elements/Input.vue";
import Button from "../../../components/Elements/Button.vue";
import { inject, onMounted, ref } from "vue";
import { POST } from "../../../services/api";
import { isEmpty, isEmail } from "../../../services/validate";
import { useRoute, useRouter } from "vue-router";
import { cnpj } from 'cpf-cnpj-validator';

export default {
  name: "createUser",
  components: {
    Input,
    Button,
  },

  setup() {
    //SERVICES
    const loader = inject("loading");
    const alert = inject("alert");
    const router = useRouter();
    const alertProps = inject("alert");
    const route = useRoute();

    //DATA
    const data = ref({
      name: "",
      cnpj: "",
      code: "",
      'phone_number': "",
      email: "",
      logo: "",
    });
    //*
    //OTHERS
    const defaultLabel = ref(
      route.name
        .split("/")[0]
        .substring(0, route.name.split("/")[0].length - 1)
        .toLowerCase()
    );

    //LOGIC
    const create = async () => {
      const objRequest = new FormData();
      const item = data.value;

      for (const key in item) {
        if (item[key])
          objRequest.append(key, item[key]);
      }
      const cnpjValidate = cnpj.isValid(data.value.cnpj);
      const emailValidate = isEmail(data.value.email);
      const validate = isEmpty(data.value);
      if (validate || emailValidate || !cnpjValidate) {
        if(validate){
          alert.open("Atenção!", validate, "warning");
        }else if(emailValidate){
          alert.open("Atenção!", emailValidate, "warning");
        } else {
          alert.open("Atenção!", "*CNPJ inválido.", "warning");
        }
      } else {
        loader.open();
        try {
          const response = await POST(`institutions`, objRequest);
          alert.open(
            "Sucesso!",
            `${
              "Instituição"
            } <b>${response.name}</b> criada com sucesso!`,
            "success"
          );
          loader.close();
          router.push(`/adm/instituicoes`);
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
      }
    };

    const changeImage = (event) => {
      const obj = {
        name: data.value.name,
        cnpj: data.value.cnpj,
        code: data.value.code,
        'phone_number': data.value.phone_number,
        email: data.value.email,
        logo: event.target.files[0],
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
      changeImage,
      readURL
    };
  },
};
</script>

<style>
</style>