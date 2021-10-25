<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">
      Criar um novo {{ route.name.split("/")[1].slice(0, -2).toLowerCase() }}
    </h3>
    <span class="text-sm text-gray-500"
      >Preencha as informações abaixo e clique no botão <b>cadastrar doador</b> para
      confirmar a criação!
    </span>
  </div>

  <div class="shadow-sm bg-white border p-8">
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="data.name"
          type="default"
          label="Nome"
          placeholder="Nome do Usuário"
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="data.document"
          type="cpf_cnpj"
          label="CPF ou CNPJ"
          placeholder="CPF ou CNPJ"
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="data.birthday"
          type="birthday"
          placeholder="XX/XX/XXXX"
          label="Data de aniversário"
        />
      </div>
    </span>
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="data.phone_number"
          type="whats"
          label="WhatsApp"
          placeholder="WhatsApp"
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="data.email"
          type="default"
          label="E-mail"
          placeholder="E-mail"
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="data.password"
          type="password"
          label="Senha"
          placeholder="Senha"
        />
      </div>
      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.blood_donator"
          type="select"
          label="É doador de sangue?"
          placeholder="Selecione um item"
          :data="[
            { label: 'Sim', value: '1' },
            { label: 'Não', value: '0' }
          ]"
        />
      </div>
      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.welcome_email"
          type="select"
          label="Email de boas-vindas?"
          placeholder="Selecione um item"
          :data="[
            { label: 'Sim', value: '1' },
            { label: 'Não', value: '0' }
          ]"
        />
      </div>
    </span>
  </div>
  <div class="flex justify-end mt-5">
    <Button @click="create" color="primary" :text="`Cadastrar doador`"/>
  </div>
</template>

<script>
import Input from "../../../components/Elements/Input.vue";
import Button from "../../../components/Elements/Button.vue";
import { inject, ref } from "vue";
import { POST } from "../../../services/api";
import { isEmpty, isEmail, isBirthday } from "../../../services/validate";
import { useRoute, useRouter } from "vue-router";
import { cpf, cnpj } from 'cpf-cnpj-validator';


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
      name: "",
      email: "",
      birthday: "",
      password: "",
      'phone_number': "",
      document: "",
      'blood_donator': "",
      'welcome_email': "",
      nivel: 'PADRINHO'
    });
    //*

    const defaultLabel = ref(
      route.name
        .split("/")[1]
        .slice(0, -1)
        .toLowerCase()
    );

    const create = async () => {
      let documentValidate = null;
      data.value.document.length > 14
        ? documentValidate = cnpj.isValid(data.value.document)
        : documentValidate = cpf.isValid(data.value.document);
      const emailValidate = isEmail(data.value.email);
      const birthdayValidate = isBirthday(data.value.birthday);
      const validate = isEmpty(data.value);
      if (validate || emailValidate || !documentValidate || !birthdayValidate) {
        if(validate){
          alert.open("Atenção!", validate, "warning");
        }else if(emailValidate){
          alert.open("Atenção!", emailValidate, "warning");
        } else if(!documentValidate) {
          data.value.document.length > 14
            ? alert.open("Atenção!", "*CNPJ inválido.", "warning")
            : alert.open("Atenção!", "*CPF inválido.", "warning");
        } else {
          alert.open("Atenção!", "*Data de aniversário inválida.", "warning");
        }
      } else {
        loader.open();
        const year = data.value.birthday.split('/')[2];
        const month = data.value.birthday.split('/')[1];
        const day = data.value.birthday.split('/')[0];
        try {
          data.value.birthday = `${year}-${month}-${day}`;
          const response = await POST("dashboard/register", data.value);
          alert.open(
            "Sucesso!",
            `Doador <b>${response.user.name}</b> criado com sucesso!`,
            "success"
          );
          loader.close();
          router.push(`/adm/${defaultLabel.value}s/detalhes/${response.user.id}`);
        } catch (e) {
          if(e){
            if(e.includes("Token")) {
              alert.open("Atenção!", e, "danger");
              localStorage.removeItem('token');
              localStorage.removeItem('info');
              router.push('/login');
            } else {
              alert.open("Atenção!", e, "danger");
            }
          } else if(data.value.password.length < 6) {
            alert.open("Atenção!", "*Senha deve ter pelo menos 6 caracteres", "danger");
          } else {
            alert.open("Atenção!", "*CPF ou Email já cadastrado", "danger");
          }
          data.value.birthday = `${day}/${month}/${year}`;
          loader.close();
        }
      }
    };
    return {
      alertProps,
      data,
      create,
      route,
      defaultLabel,
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