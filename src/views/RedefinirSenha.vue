<template>
  <div class="flex items-center justify-center min-h-screen p-6 bg-quaternary dark:bg-gray-900">
    <div
      class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
        <div class="flex flex-col overflow-y-auto md:flex-row">
            <div class="logoContainer h-32 md:h-auto md:w-1/2">
                <img
                    aria-hidden="true"
                    class="logo object-cover dark:hidden"
                    src="favicon.ico"
                    alt="Office"
                />
            </div>
            <div  class="flex-col items-center justify-center p-6 sm:p-12 md:w-1/2">
                <h1 class="mb-4 text-3xl text-center text-gray-700 dark:text-gray-200">
                    Esqueci minha senha
                </h1>

                <p class="mb-4 m-auto my-10 text-justify text-gray-700 dark:text-gray-200">
                    Para redefinir sua senha, informe o e-mail cadastrado na sua conta 
                    e lhe enviaremos uma mensagem contendo a nova senha gerada automaticamente.
                </p>

                <div class="m-auto my-10">
                    <Input
                        v-model="user.email"
                        type="default"
                        label="Email"
                        placeholder="Email"
                    />
                </div>

                <div class="m-auto mt-10">
                    <Button type="mobile" color="primary" :text="`Continuar`" @click="resetPassword" />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import Input from '@/components/Elements/Input.vue';
import Button from '../components/Elements/Button.vue'
import { isEmail, isEmpty } from "../services/validate";
import { PUT } from '@/services/api';
import { useRouter } from 'vue-router';

export default {
  name: "Login",
  components: {
    Input,
    Button
  },
  setup() {
    const alert = inject("alert");
    const loader = inject("loading");
    const router = useRouter();

    const user = ref({
      email: "",
    });

    const resetPassword = async () => {
        loader.open();
        const validate = isEmpty(user.value);
        const emailValidate = isEmail(user.value.email);
        if(validate || emailValidate) {
            emailValidate && alert.open("Atenção!", emailValidate, "warning");
            validate && alert.open("Atenção!", validate, "warning");
        } else {
            try {
                await PUT('reset_password', user.value);
                alert.open("Sucesso!", `Mensagem encaminhada com sucesso para ${user.value.email}.`, "success");
                router.push('/login');
                loader.close();
            } catch (e) {
                alert.open("Atenção!", e, "danger");
                loader.close();
            }
        }
    };

    return { user, resetPassword };
  },
};
</script>

<style scoped>
    .logo{
        width: 286px;
        height: 238.59px;
        margin: 0 auto;
    }

    .logoContainer{
        margin-bottom: 4rem;
    }

  @media only screen and (min-width: 768px) {
      .logo{
        width: 100%;
        height: 100%;
      }

      .logoContainer{
            margin-bottom: 0;
        }
  }
</style>
