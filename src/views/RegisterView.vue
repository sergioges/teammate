<script>
import { reactive, ref } from "vue";
import { sendNewUserService } from "@/services/RegisterServices";
import router from "@/router/router";
import Alert from "@/components/library/Alert.vue";
import ImageLoading from "@/components/loading/ImageLoading.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "RegisterView",
   components: {
    Alert,
    ImageLoading
  },
  setup() {
    // Data
    const userData = reactive({
      name: "",
      email: "",
      password: "",
    });
    const alertData = ref({});
    const showAlert = ref(false);
    const isLoading = ref(false);

    const { t } = useI18n();
    const placeholderName = t("register.name");
    const placeholderEmail = t("register.email");
    const placeholderPassword = t("register.password");
    const modalErrorMessage = t("modal.error.message");

    // Methods
    const sendData = async () => {
      isLoading.value = true;
      const serviceData = await sendNewUserService(userData);
      if (serviceData.controlError) {
        console.log(serviceData);
        isLoading.value = false;
          alertData.value = {
            definition: 'danger',
            message: modalErrorMessage,
          }
          showAlert.value = true;
          setTimeout(() => {
            showAlert.value = false;
          }, 2000)
      } else {
        isLoading.value = false;
        router.push({path: "login", query:{newUser: true}});
      }
    };

    const sendView = (view) => {
      router.push(view);
    };

    return { userData, alertData, showAlert, placeholderName, placeholderEmail, placeholderPassword, isLoading, sendData, sendView };
  },
};
</script>

<template>
  <div class="login py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto">
      <img src="../assets/logo_complete.png" alt="" width="200" height="200" @click="sendView('/')" />
      <alert
        v-if="showAlert"
        :alert-data="alertData"
      ></alert>
      <form @submit.prevent="sendData">
        <h1 class="h3 mb-3 fw-normal">{{ $t("register.title") }}</h1>
        <div class="form-floating">
          <input
            v-model="userData.name"
            type="text"
            class="form-control"
            id="userName"
            :placeholder="placeholderName"
            required
          />
          <label for="floatingInput">{{ $t("register.name") }}</label>
        </div>
        <div class="form-floating">
          <input
            v-model="userData.email"
            type="email"
            class="form-control"
            id="userEmail"
            :placeholder="placeholderEmail"
            required
          />
          <label for="userEmail">{{ $t("register.email") }}</label>
        </div>
        <div class="form-floating">
          <input
            v-model="userData.password"
            type="password"
            class="form-control"
            id="userPassword"
            :placeholder="placeholderPassword"
            required
          />
          <label for="userPassword">{{ $t("register.password") }}</label>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit">
          {{ $t("register.button.register") }}
        </button>
        <button class="btn btn-outline-secondary w-100 py-2 mt-2" type="button" @click="sendView('/login')">
          {{ $t("register.button.user") }}
        </button>
      </form>
    </main>
    <image-loading v-if="isLoading" />
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_register.scss";
</style>