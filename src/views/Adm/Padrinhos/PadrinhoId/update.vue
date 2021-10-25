<template>
  <div class="my-6">
      <div class="flex">
        <h3 class="font-bold text-primary mr-4">Detalhes da doação / {{userData.name}}</h3>
        <i @click="push" :class="`gg-link cursor-pointer text-primary`"></i>
      </div>
    <span class="text-sm text-gray-500"
      >Olá, está sendo exibida as informações da doação do <b>{{userData.name}}</b>, 
      {{ document }} {{userData.document}},
      email {{userData.email}},
      com o telefone de contato {{userData.phone_number}}.
    </span>
  </div>

  <div class="shadow-sm bg-white border p-8">
    <span class="lg:inline-grid w-full grid-cols-3 gap-x-4">
      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.notification_type"
          type="radio"
          label="Tipo de notificação"
          name="notification_type"
          :data="[
            { label: 'WhatsApp', value: 'WHATSAPP' },
            { label: 'Email', value: 'EMAIL' }
          ]"
        />
      </div>

      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.recurrence_interval"
          type="default"
          label="Recorrência"
          placeholder="Selecione um item"
          readonly
        />
      </div>

      <div v-if="data.recurrence_interval === 'Única'" class="customizeSchedule col-span-2 inline-block flex-1 m-3">
        <Input
          v-model="schedulePayment"
          type="radio"
          label="Deseja agendar o pagamento?"
          name="schedule_payment"
          :data="[
            { label: 'Sim', value: '1' },
            { label: 'Não', value: '0' }
          ]"
        />
      </div>

      <div v-if="data.recurrence_interval === 'Mensal' || schedulePayment === '1'" class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.recurrence_day"
          type="radio"
          label="Dia da doação"
          :data="[
            { label: 'Dia 5', value: 5 },
            { label: 'Dia 10', value: 10 },
            { label: 'Dia 15', value: 15 },
            { label: 'Dia 20', value: 20 },
          ]"
        />
      </div>

      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.fixed_value"
          type="money"
          label="Valor"
          placeholder="Digite o valor"
        />
      </div>
    </span>
  </div>
  <div class="flex justify-end mt-5 mb-10">
    <Button @click="update" color="primary" :text="`Salvar`" />
  </div>

  <hr>

    <h3 class="font-bold text-primary mt-5">Transações</h3>
    <div class="card mt-10 mb-20">
      <DataTable
          :headers="headers"
          :data="transactions"
          :options="options"
          :exports="true"
          color="primary"
      />
    </div>
</template>

<script>
import Input from "../../../../components/Elements/Input.vue";
import Button from "../../../../components/Elements/Button.vue";
import DataTable from "../../../../components/Elements/Datatable.vue";
import { inject, ref, onMounted } from "vue";
import { GET, PUT } from "../../../../services/api";
import { isEmpty } from "../../../../services/validate";
import { useRoute, useRouter } from "vue-router";
import { numberToCnpj, numberToCpf, toCelPhone, toPhone } from '@/services/formater';


export default {
  name: "donationEdit",
  components: {
    Input,
    Button,
    DataTable
  },

  setup() {

    const loader = inject("loading");
    const alert = inject("alert");
    const modal = inject("modal");
    const alertProps = inject("alert");
    const route = useRoute();
    const router = useRouter();
    //DATA
    const data = ref({});
    const userData = ref([]);
    const transactions = ref({});
    const notifications = ref([]);
    const document = ref('');
    const schedulePayment = ref('');
    //*

    const headers = [
      { key: "ID", value: "id"},
      { key: "Data criação", value: "created_at", date: true},
      { key: "Valor", value: "value", money: true},
      { 
        key: "Status", 
        value: "status", 
        badge: { 
          "PAGO": "green", 
          "PENDENTE": "red",
          "EXPIRADO": "yellow"
        } 
      },
      { key: "Pix", value: "pix", copy: true}
    ];

    const update = async () => {
      const handle = async () => {
        data.value.recurrence_interval === 'Única' && schedulePayment.value !== '1' && (data.value['recurrence_day'] = '0');
        const validate = isEmpty(data.value);
        if (validate) {
          alert.open("Atenção!", validate, "warning");
        } else if(data.value.fixed_value.includes('R$') && (data.value.fixed_value.split(' ')[1] === '' || data.value.fixed_value.split(' ')[1] === undefined || parseInt(data.value.fixed_value.split(' ')[1]) === 0)) {
          alert.open("Atenção!", '*Valor não reconhecido', "warning");
        } else {
          loader.open();
          try {
            //Retirar o R$
            (data.value['fixed_value'].split(' ')[1]) 
              && (data.value['fixed_value'] = data.value.fixed_value.split(' ')[1]);
            //eliminar pontos
            if(data.value['fixed_value'].length > 6) {
              data.value['fixed_value'] = data.value.fixed_value.split('.').join('');
            }
            //Subs , por .
            data.value['fixed_value'] = data.value.fixed_value.replace(',', '.');
            
            await PUT(`donations/users/invited/${route.params.id}/unique`, data.value);
            transactions.value = await GET(`transactions/donations/${route.params.id}`);
            transactions.value.map( transaction => {
              switch (transaction.status) {
                case 'PENDING':
                  transaction.status = 'PENDENTE'
                  break;
                case 'PAID':
                  transaction.status = 'PAGO';
                  break;
                case 'EXPIRED':
                  transaction.status = 'EXPIRADO'
              }
            })
            alert.open(
              "Sucesso!",
              `Doação editada com sucesso!`,
              "success"
            );
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
        }
      };

      const cancelFunction = () => {
        modal.close()
      };

      modal.open({
        title: "Atenção",
        message: "Deseja realmente editar essa doação?",
        confirmMessage: "Confirmar",
        callbackOK: () => handle(),
        callbackCancel: () => cancelFunction(),
      })
    };

    const push = () => {
        window.open(route.path.split('/').splice(0, 5).join('/'), "_blank");
    }

    onMounted(async () => {
      try {
        loader.open();
        userData.value = await GET(`users/${route.path.split('/')[4]}`);
        if (userData.value.document.length > 11) {
          userData.value.document = numberToCnpj(userData.value.document);
          document.value = 'CNPJ';
        } else{
          userData.value.document = numberToCpf(userData.value.document);
          document.value = 'CPF';
        }
        userData.value.phone_number.length > 10
          ? userData.value['phone_number'] = toCelPhone(userData.value.phone_number)
          : userData.value['phone_number'] = toPhone(userData.value.phone_number);
        data.value = await GET(`donations/${route.params.id}`);
        data.value['recurrence_interval'] = data.value.recurrence_interval === "UNICA" ? "Única" : "Mensal";
        data.value['fixed_value'] = data.value['fixed_value'].replace('.', ',');
        schedulePayment.value = data.value.recurrence_interval === 'MENSAL' || (data.value.recurrence_interval === 'UNICA' && (data.value.recurrence_day > 0 && data.value.recurrence_day < 25))
          ? '1'
          : '0';
        transactions.value = await GET(`transactions/donations/${route.params.id}`);
        transactions.value.map( transaction => {
          switch (transaction.status) {
            case 'PENDING':
              transaction.status = 'PENDENTE'
              break;
            case 'PAID':
              transaction.status = 'PAGO';
              break;
            case 'EXPIRED':
              transaction.status = 'EXPIRADO'
          }
        })

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

    return {
      alertProps,
      data,
      userData,
      update,
      route,
      headers,
      transactions,
      push,
      notifications,
      document,
      schedulePayment
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