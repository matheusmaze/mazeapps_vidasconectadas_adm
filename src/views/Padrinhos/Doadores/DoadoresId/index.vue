<template>
  <div class="w-full mt-6 mb-8">
    <h3 class="font-bold text-primary">Doador / {{userData.name}}</h3>
    <span class="text-sm text-gray-500"
      >Aqui você pode observar todos os itens relacionados ao doador {{userData.name}}, como
      suas respectivas ações.
    </span>
  </div>
  <div class="shadow-sm bg-white border p-8">
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="userData.name"
          type="default"
          label="Nome"
          placeholder="Nome do Usuário"
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="userData.document"
          type="default"
          label="CPF ou CNPJ"
          readonly
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="userData.birthday"
          type="birthday"
          placeholder="XX/XX/XXXX"
          label="Data de aniversário"
        />
      </div>
    </span>
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="userData.phone_number"
          type="whats"
          label="WhatsApp"
          placeholder="WhatsApp"
        />
      </div>
      <div class="inline-block flex-1 m-3">
        <Input
          v-model="userData.email"
          type="default"
          label="E-mail"
          placeholder="E-mail"
        />
      </div>
      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="userData.blood_donator"
          type="select"
          label="É doador de sangue?"
          placeholder="Selecione um item"
          :data="[
            { label: 'Sim', value: '1' },
            { label: 'Não', value: 'nao' }
          ]"
        />
      </div>
    </span>
  </div>
  <div class="flex justify-end mt-5 mb-10">
    <Button @click="update" color="primary" :text="`Salvar`" />
  </div>

  <hr>

  <h3 class="font-bold text-primary mt-5">Doações</h3>
  <div class="card mt-10 mb-20">
    <DataTable
      :headers="headers"
      :data="data"
      :options="options"
      color="primary"
    />
    <div class="flex justify-end mt-5">
      <router-link :to="`${route.path}/criar`">
        <Button color="primary" :text="`Criar Doação`" />
      </router-link>
    </div>
  </div>
</template>

<script>
import Button from "../../../../components/Elements/Button.vue";
import Input from "../../../../components/Elements/Input.vue";
import DataTable from "../../../../components/Elements/Datatable.vue";
import { inject, onMounted, ref } from "vue";
import { GET, DELETE, PUT } from "../../../../services/api";
import { isEmpty, isEmail, isBirthday } from "../../../../services/validate";
import { useRoute, useRouter } from "vue-router";
import { numberToCnpj, numberToCpf, toCelPhone, toDate, toPhone } from '@/services/formater';

export default {
  name: "user",
  components: {
    Button,
    DataTable,
    Input
  },
  setup() {
    const headers = [
      { key: "ID", value: "id"},
      { key: "Data", value: "created_at", date: true},
      { key: "Valor", value: "fixed_value", money: true},
      { key: "Tipo", value: "recurrence_interval"},
      { 
        key: "Status", 
        value: "donationStatus", 
        badge: { 
          "Ativa": "green", 
          "Inativa": "red"
        } 
      },
      { key: "Opções", value: ""}
    ];


    const route = useRoute();
    const router = useRouter();
    const modal = inject("modal");
    const alert = inject("alert");
    const loader = inject("loading");

    const userData = ref([]);
    const data = ref([]);

    const update = async () => {
      const handle = async () => {
        const emailValidate = isEmail(userData.value.email);
        const birthdayValidate = isBirthday(userData.value.birthday);
        const validate = isEmpty(userData.value);
        if (validate || emailValidate || !birthdayValidate) {
          if(validate){
            alert.open("Atenção!", validate, "warning");
          } else if (emailValidate){
            alert.open("Atenção!", emailValidate, "warning");
          } else {
            alert.open("Atenção!", "*Data de aniversário inválida.", "warning");
          }
        } else {
          loader.open();
          const year = userData.value.birthday.split('/')[2];
          const month = userData.value.birthday.split('/')[1];
          const day = userData.value.birthday.split('/')[0];
          try {
            //corrigindo o valor a ser encaminhado para o backend caso a opcao "Não" seja selecionada
            userData.value['blood_donator'] === 'nao' && (userData.value['blood_donator'] = '0')
            userData.value.birthday = `${year}-${month}-${day}`;
            const response = await PUT(`users/${userData.value.id}`, userData.value);
            alert.open(
              "Sucesso!",
              `Doador
              <b>${response.user.name}</b> editado com sucesso!`,
              "success"
            );
            userData.value['blood_donator'] == 0 && (userData.value['blood_donator'] = 'nao');
            userData.value.birthday = toDate(userData.value.birthday);
            loader.close();
          } catch (e) {
            alert.open("Atenção!", e, "danger");
            userData.value['blood_donator'] === '0' && (userData.value['blood_donator'] = 'nao')
            userData.value.birthday = `${day}/${month}/${year}`;
            loader.close();
          }
        }
      };

      const cancelFunction = () => {
        modal.close()
      }

      modal.open({
        title: "Atenção",
        message: "Deseja realmente editar esse doador?",
        confirmMessage: "Confirmar",
        callbackOK: () => handle(),
        callbackCancel: () => cancelFunction(),
      })
    };

    onMounted(async () => {
      try {
        loader.open();
        userData.value = await GET(`users/${route.params.id}`);
        userData.value.document.length > 11
          ? userData.value.document = numberToCnpj(userData.value.document)
          : userData.value.document = numberToCpf(userData.value.document);
        userData.value.phone_number.length > 10
          ? userData.value['phone_number'] = toCelPhone(userData.value.phone_number)
          : userData.value['phone_number'] = toPhone(userData.value.phone_number);
        userData.value['blood_donator'] == 0 && (userData.value['blood_donator'] = 'nao');
        userData.value.birthday = toDate(userData.value.birthday);
        data.value = await GET(`donations/users/${route.params.id}`);
        data.value.donationStatus = '';
        data.value.map( el => {
          el.status === 'ACTIVE' ? (el.donationStatus = "Ativa") : (el.donationStatus = "Inativa");
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
      const deleteFunction = async function () {
        loader.open();
        try {
          loader.open();
          await DELETE(`donations/${donation.id}`);
          data.value = await GET(`donations/users/${route.params.id}`);
          data.value.donationStatus = '';
          data.value.map( el => {
            el.status == 'ACTIVE' ? (el.donationStatus = "Ativa") : (el.donationStatus = "Inativa");
          });
          loader.close();
          alert.open("Sucesso!", `Doação desativada com sucesso!`, "success");
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
        message: "Deseja realmente desativar essa doação?",
        confirmMessage: "Confirmar",
        callbackOK: () => deleteFunction(),
        callbackCancel: () => cancelFunction(),
      })


      loader.close();
    };

    const show = (donation) => {
      router.push(`${route.path.split('/').splice(0, 4).join('/')}/editar/${donation.id}`);
    };

    const options = [
      { icon: "pen", action: (param) => show(param), title: 'Detalhes da doação' },
      { icon: "trash", action: (param) => deleteItem(param), title: 'Desativar doação' },
    ];

    return { headers, route, options, data, userData, update };
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