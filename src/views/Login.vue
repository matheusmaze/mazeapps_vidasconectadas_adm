<template>
  <div class="flex items-center min-h-screen p-6 bg-quaternary dark:bg-gray-900">
    <div
      class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div class="flex flex-col overflow-y-auto md:flex-row">
        <div class="h-32 md:h-auto md:w-1/2">
          <img
            aria-hidden="true"
            class="object-cover w-full h-full dark:hidden"
            src="favicon.ico"
            alt="Office"
          />
        </div>
        <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
          <div class="w-full">
            <h1
              class="vidasConectadas_title mb-4 text-xl font-regular text-gray-700 dark:text-gray-200"
            >
              Bem vindo ao
              <strong class="text-ternary">Vidas Conectadas</strong>
              <!-- <p class="text-sm text-gray-400 opacity-80">
                Adminstrativo
              </p> -->
            </h1>
            <div class="mb-5 mt-10">
              <Input
                type="cpf_cnpj"
                v-model="user.document"
                placeholder="CPF / CNPJ"
                label="CPF / CNPJ"
              />
            </div>

            <Input
              v-model="user.password"
              type="password"
              :showTip="false"
              placeholder="*******"
              label="Senha"
            />

            <!-- You should use a button here, as the anchor is only used for the example  -->
            <a
              @click="login"
              class="block cursor-pointer w-full px-5 py-4 mt-10 text-sm font-medium leading-5 text-center text-white rounded-lg transition-colors duration-150 bg-ternary border border-transparent active:bg-purple-600 hover:bg-ternary focus:outline-none focus:shadow-outline-purple"
            >
              Entrar
            </a>

            <p class=" text-center mt-10">
              <router-link
                class="text-sm  font-medium text-ternary dark:text-purple-400 hover:underline"
                to="/redefinir-senha"
              >
                Esqueceu sua senha?
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import Input from "../components/Elements/Input";
import { useRouter } from "vue-router";
import { LOGIN, instance, POST } from "../services/api";
import { isEmpty } from "../services/validate";
import { decodeJwt } from "../services/util";
export default {
  name: "Login",
  components: {
    Input,
  },
  setup() {
    const user = ref({
      document: "",
      password: "",
    });

    const alert = inject("alert");
    const loader = inject("loading");
    const router = useRouter();

    // onMounted(() => {
    //   const isAuth = localStorage.getItem("token") ? true : false;
    //   if (isAuth) {
    //     router.push({ path: "/" });
    //   }
    // });

    const login = async () => {
      const validate = isEmpty(user.value);

      if (validate) {
        alert.open("Atenção!", validate, "warning");
      } else {
        loader.open();
        try {
        user.value.document.length > 14
          ? user.value.document = user.value.document.split('.').join('').replace('/', '').replace('-', '')
          : user.value.document = user.value.document.split('.').join('').replace('-', '');
          const data = await POST("login", user.value);
          const token = data.token;
          localStorage.setItem("t_vidas", token);
          instance.defaults.headers.Authorization = token
            ? `Bearer ${token}`
            : "";
          localStorage.setItem("info_vidas", JSON.stringify(decodeJwt(token)));
          //Definindo as rotas de acordo com o id do login realizado
          const info = JSON.parse(localStorage.getItem("info_vidas"));
          switch (info.nivel) {
            case 'MASTER':
              router.push({ path: "/adm" });
              break;
            case 'NEGOCIADOR':
              router.push({ path: "/comprador" });
              break;
            case 'PADRINHO':
              router.push({ path: "/" });
              break;
            default:
              //redirecionando para página login caso o login não tenha sido realizado
              router.push({path: "/login"});
              break;
          }
          loader.close();
        } catch (e) {
          alert.open("Atenção!", e, "warning");
          loader.close();
        }
      }
    };

    return { login, user };
  },
};
</script>

<style>
  .vidasConectadas_title{
    text-align: center;
  }

  @media only screen and (min-width: 768px) {

      .vidasConectadas_title{
        text-align: left;
      }
  }
</style>
