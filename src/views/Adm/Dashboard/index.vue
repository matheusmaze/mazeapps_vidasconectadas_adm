<template>
  <div class="home w-full">
    <h2 class="my-6 text-2xl font-medium dark:text-gray-200 text-primary">
      Dashboard
    </h2>
    <!-- <Alert
      label="Você recebeu mais de 200 visitas na ultima semana."
      icon="danger"
      color="primary"
      @click="event"
    /> -->
    <div class="container flex mb-9">
      <template v-for="item in status" :key="item.id">
        <Card
          v-if="item.icon"
          color="secondary"
          :icon="item.icon"
          :label="item.name"
          :number="item.qtd"
        />
      </template>
    </div>

    <hr>
<!-- 
    <div class="card shadow-lg border rounded-lg p-8 bg-white mt-9">
      <div class="w-full">
        <div class="flex-3 w-full">
          <h3 class="font-bold text-primary">Gráficos de Inteligência</h3>
          <span class="text-sm text-gray-500"
            >Aqui você pode observar todos os itens que foram buscados por
            usuários mas não foram encontrados no sistema
          </span>
        </div>

        <div class="my-9">
          <Input
            type="select"
            label="Meses"
            :data="[
              { label: 'Janeiro', value: 1 },
              { label: 'Fevereiro', value: 2 },
              { label: 'Março', value: 3 },
              { label: 'Abril', value: 4 },
              { label: 'Maio', value: 5 },
              { label: 'Junho', value: 6 },
              { label: 'Julho', value: 7 },
              { label: 'Agosto', value: 8 },
              { label: 'Setembro', value: 9 },
              { label: 'Outubro', value: 10 },
              { label: 'Novembro', value: 11 },
              { label: 'Dezembro', value: 12 },
            ]"
            v-model="mes"
          />
        </div>

        <div>
          <div id="graphs" class="flex w-full my-5">
            <div class="flex-1  w-1/3">
              <p class="text-sm text-center">Faturamento</p>
              <Chart
                chartId="1"
                type="doughnut"
                :labels="['Dinheiro', 'Cartão']"
                :data="revenue"
              />
            </div>
            <div class="flex-1">
              <p class="text-sm text-center">Ticket médio do pedido</p>
              <Chart
                chartId="2"
                type="doughnut"
                :labels="['Entrega', 'Delivery']"
                :data="ticket"
              />
            </div>
            <div class="flex-1 ">
              <p class="text-sm text-center">Pedidos de clientes</p>
              <Chart
                chartId="3"
                type="doughnut"
                :labels="['Novos', 'Antigos']"
                :data="ordersByUsers"
              />
            </div>
          </div>
        </div>

        <div>
          <div class="my-5">
            <p class="text-sm text-center">Pedidos por hora</p>
            <Chart
              chartId="4"
              type="line"
              label="Pedidos por Hora"
              :labels="['']"
              :data="[]"
            />
          </div>

          <div class="my-5">
            <p class="text-sm text-center">Novos cadastros por dia</p>
            <Chart
              chartId="5"
              type="line"
              label="Novos Cadastros"
              :labels="['']"
              :data="[]"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="flex-3 w-full my-8">
          <h3 class="font-bold text-primary">Aniversariantes</h3>
          <span class="text-sm text-gray-500"
            >Dados sobre os usuários que fazem aniversario no mês.
          </span>
        </div>
        <DataTable
          :headers="headers"
          :data="data.birthdays"
          :options="options"
          color="primary"
        />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from "vue";
import Card from "../../../components/Elements/Card.vue";
// import Chart from "../../../components/Chart/Chart.vue";
// import Input from "../../../components/Elements/Input.vue";
// import DataTable from "../../../components/Elements/Datatable.vue";
import { useRouter } from "vue-router";
import { GET } from "../../../services/api";
import ChartJs from "chart.js";
interface LoadImplements {
  open: Function;
  close: Function;
}

export default defineComponent({
  name: "Home",
  components: {
    Card,
    // Chart,
    // Input,
    // DataTable,
  },

  setup() {
    const headers = [
      { key: "Id", value: "id" },
      { key: "Nome", value: "name" },
      { key: "E-mail", value: "email" },
      { key: "Data de aniversário", value: "birthday", date: true },
      { key: "Ultimo pedido", value: "pedido" },
      { key: "Data do pedido", value: "pedido" },
      { key: "Options", value: "" },
    ];
    
    const options = [{ icon: "eye", action: (param) => alert(param) }];

    const loader: LoadImplements = inject("loading") as LoadImplements;
    const router = useRouter();
    const users = ref([]);
    const status = ref([
      {
        icon: "user",
        id: 1,
        name: "Doadores",
        qtd: 0,
      },
      {
        icon: "briefcase",
        id: 2,
        name: "Instituições",
        qtd: 0,
      },
      {
        icon: "card-hearts",
        id: 3,
        name: "Doações",
        qtd: 0,
      },
      {
        icon: "dollar",
        id: 4,
        name: "Compras",
        qtd: 0,
      },
    ]);

    const data = ref({});

    const revenue = ref([0, 0]);
    const ordersByUsers = ref([0, 0]);
    const ordersByHours = ref([
      {
        Day: Number,
        Hour: Number,
        ["count_orders"]: Number,
      },
    ]);
    const usersPerDay = ref([
      {
        Day: Number,
        ["new_users"]: Number,
      },
    ]);

    const ticket = ref([0, 0]);

    const mes = ref();

    const optionsGrafico = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };

    const event = () => {
      alert("ok");
    };

    const reconstroiGraficos = () => {
      const graficoFaturamento = document.getElementById(
        "1" || ""
      ) as HTMLCanvasElement;

      new ChartJs(graficoFaturamento, {
        type: "doughnut",
        data: {
          labels: ["Dinheiro", "Cartão"],
          datasets: [
            {
              label: `Quantidade de Faturamento`,
              data: revenue.value,
              backgroundColor: [
                "#1C74B4",
                "#1C74B4aa",
                "#1C74B4bb",
                "#1C74B4cc",
              ],
              borderColor: [`#1C74B4aa`],
              borderWidth: 2,
            },
          ],
        },
        options: optionsGrafico,
      });

      const graficoTicket = document.getElementById(
        "2" || ""
      ) as HTMLCanvasElement;

      new ChartJs(graficoTicket, {
        type: "doughnut",
        data: {
          labels: ["Retirada", "Delivery"],
          datasets: [
            {
              label: `Quantidade de Entregas`,
              data: ticket.value,
              backgroundColor: [
                "#1C74B4",
                "#1C74B4aa",
                "#1C74B4bb",
                "#1C74B4cc",
              ],
              borderColor: [`#1C74B4aa`],
              borderWidth: 2,
            },
          ],
        },
        options: optionsGrafico,
      });

      const graficoClientes = document.getElementById(
        "3" || ""
      ) as HTMLCanvasElement;
      new ChartJs(graficoClientes, {
        type: "doughnut",
        data: {
          labels: ["Novos", "Antigos"],
          datasets: [
            {
              label: `Quantidade de Clientes`,
              data: ordersByUsers.value,
              backgroundColor: [
                "#1C74B4",
                "#1C74B4aa",
                "#1C74B4bb",
                "#1C74B4cc",
              ],
              borderColor: [`#1C74B4aa`],
              borderWidth: 2,
            },
          ],
        },
        options: optionsGrafico,
      });

      const hours: Array<string> = [];
      const orders: Array<any> = [];

      ordersByHours.value.forEach((order) => {
        const hs = order.Hour.toString();
        hours.push(hs);
        orders.push(order["count_orders"]);
      });

      const graficoPedidos = document.getElementById(
        "4" || ""
      ) as HTMLCanvasElement;
      new ChartJs(graficoPedidos, {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: `Quantidade de Pedidos por hora`,
              data: orders,
              backgroundColor: ["rgba(0,0,0,0)"],
              borderColor: [`#1C74B4aa`],
              borderWidth: 2,
            },
          ],
        },
        options: optionsGrafico,
      });

      const days: Array<string> = [];
      const newUsers: Array<any> = [];

      usersPerDay.value.forEach((user) => {
        const d = user.Day.toString();
        days.push(d);
        newUsers.push(user["new_users"]);
      });

      const graficoNovosUsuarios = document.getElementById(
        "5" || ""
      ) as HTMLCanvasElement;
      new ChartJs(graficoNovosUsuarios, {
        type: "line",
        data: {
          labels: days,
          datasets: [
            {
              label: `Usuários novos`,
              data: newUsers,
              backgroundColor: ["rgba(0,0,0,0)"],
              borderColor: [`#1C74B4aa`],
              borderWidth: 2,
            },
          ],
        },
        options: optionsGrafico,
      });
    };

    onMounted(async () => {
      loader.open();
      
      try {
        const response = await GET(`/dashboard/cards_geral`);
        status.value[0].qtd = response.users;
        status.value[1].qtd = response.institutions;
        status.value[2].qtd = response.donations;
        status.value[3].qtd = response.buys;

        loader.close();
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('info');
        router.push('/login');
        loader.close();
      }
    });

    watch(
      () => mes.value,
      async (mes) => {
        const dataAtual = new Date();
        const dataIso = dataAtual.toISOString();
        const dataComMes = `${dataIso.split("-")[0]}-${mes}-${
          dataIso.split("-")[2]
        }`;
        const response = await GET(`dashboard/${dataComMes}`);
        data.value = response;
        revenue.value[0] = parseFloat(response.revenue.money);
        revenue.value[1] = parseFloat(response.revenue.card);
        ordersByUsers.value[0] = response["orders_by_user"]["new_users"];
        ordersByUsers.value[1] = response["orders_by_user"]["old_users"];
        ordersByHours.value = response["orders_by_hour"];
        usersPerDay.value = response["new_users_per_day"];
        reconstroiGraficos();
      }
    );

    return {
      event,
      data,
      headers,
      options,
      users,
      status,
      revenue,
      ticket,
      ordersByUsers,
      mes,
    };
  },
});
</script>

<style scoped>
  .container{
    display: flex;
    flex-flow: row wrap;
  }
</style>
