<template>
  <div class="my-6">
    <h3 class="font-bold text-primary">Criar doação / {{userData.name}}</h3>
    <span class="text-sm text-gray-500"
      >Olá, está sendo criado uma doação para o <b>{{userData.name}}</b>, 
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
          type="select"
          label="Recorrência"
          placeholder="Selecione um item"
          :data="[
            { label: 'Única', value: 'UNICA' },
            { label: 'Mensal', value: 'MENSAL' },
          ]"
        />
      </div>

      <div class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.fixed_value"
          type="money"
          label="Valor"
          placeholder="Valor"
        />
      </div>

      <div v-if="data.recurrence_interval === 'UNICA'" class="customizeSchedule col-span-2 inline-block flex-1 m-3">
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

      <div v-if="data.recurrence_interval === 'MENSAL' || schedulePayment === '1'" class="customize inline-block flex-1 m-3">
        <Input
          v-model="data.recurrence_day"
          type="radio"
          label="Dia da doação"
          name="recurrence_day"
          :data="[
            { label: 'Dia 5', value: 5 },
            { label: 'Dia 10', value: 10 },
            { label: 'Dia 15', value: 15 },
            { label: 'Dia 20', value: 20 },
          ]"
        />
      </div>
    </span>
  </div>
  <div class="flex justify-end mt-5">
    <Button @click="create" color="primary" :text="`Criar doação`" />
  </div>
</template>

<script>
import Input from "../../../../components/Elements/Input.vue";
import Button from "../../../../components/Elements/Button.vue";
import { inject, ref, onMounted } from "vue";
import { GET, POST } from "../../../../services/api";
import { isEmpty } from "../../../../services/validate";
import { useRoute, useRouter } from "vue-router";
import { numberToCnpj, numberToCpf, toCelPhone, toPhone } from '@/services/formater';


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
    const document = ref('');
    //DATA
    const data = ref({
      'recurrence_day': "",
      'recurrence_interval': "",
      'notification_type': "EMAIL",
      'payment_type': 'PIX',
      'fixed_value': "",
      'users_id': "",
    });
    const userData = ref([]);
    const schedulePayment = ref('0');
    //*

    const create = async () => {
      data.value.recurrence_interval === 'UNICA' && schedulePayment.value !== '1' && (data.value['recurrence_day'] = '0');
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
          (data.value['fixed_value'].length > 6)
            && (data.value['fixed_value'] = data.value.fixed_value.split('.').join(''));
          //Subs , por .
          data.value['fixed_value'] = data.value.fixed_value.replace(',', '.');
          
          await POST("donations/users/invited/unique", data.value);
          alert.open(
            "Sucesso!",
            `Doação criada com sucesso!`,
            "success"
          );
          loader.close();
          router.push(route.path.split('/').splice(0, 5).join('/'));
        } catch (e) {
          alert.open("Atenção!", e, "danger");
          loader.close();
        }
      }
    };

    onMounted(async () => {
      try {
        loader.open();
        userData.value = await GET(`users/${route.params.id}`);
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
         data.value['users_id'] = userData.value.id;
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
      create,
      route,
      schedulePayment,
      document
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