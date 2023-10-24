<script>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import { defineConversationRoute } from "@/mixin/RouteControl";
import { isAuthenticated } from "@/mixin/AuthToken";
import { useImageStore } from "@/store/backgroundImage";
import router from "@/router/router";
import Alert from "@/components/library/Alert.vue";
import ImageLoading from "@/components/loading/ImageLoading.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "LoginView",
  components: {
    Alert,
    ImageLoading
  },
  setup() {
    // Data
    const route = useRoute();
    const userData = reactive({
      email: "",
      password: "",
    });
    const alertData = ref({
      definition: null,
      message: null,
    });
    const showAlert = ref(false);
    const isLoading = ref(false);

    const { t } = useI18n();
    const placeholderEmail = t("login.email");
    const placeholderPassword = t("login.password");
    const modalErrorMessage = t("modal.error.message");
    const modalUserInvalid = t("modal.error.user");

    onMounted(() => {
      if (route.query.newUser) {
        showAlert.value = JSON.parse(route.query.newUser) || false;
        alertData.value = {
          definition: "success",
          message: "New user was created :)",
        };
        setTimeout(() => {
          showAlert.value = false;
        }, 2000);
      };
      // TODO check qhy this if does not check the isAuthenticated function
      // if (sessionStorage.getItem("chatgpt-token") && isAuthenticated()) {
      //   router.push({path: "context"});
      // } else {
      //   router.push('/login');
      // };
    });

    // Methods
    const sendData = async () => {
      isLoading.value = true;
      try {
        const response = await axios.post(`${callBaseUrl()}/login`, userData);
        const token = response.data.token;
        const userId = response.data.id;

        if (token) {
          sessionStorage.setItem("chatgpt-token", token);
          sessionStorage.setItem("chatgpt-userId", userId);
          const contextResponse = await axios.get(
            `${callBaseUrl()}/context/saved/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (contextResponse.data.url) {
            const imageStore = useImageStore();
            imageStore.setCurrentImage(contextResponse.data.url);
            router.push({ path: `${defineConversationRoute()}`});
          } else {
            router.push({ path: "context" });
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        const errorStatus = error.response ? error.response.status : "desconocido";
        isLoading.value = false;
        alertData.value = {
          definition: "danger",
          message: errorStatus === 401 ? modalUserInvalid : modalErrorMessage,
        };
        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 2000);
      };
    };

    const sendView = (view) => {
      router.push(view);
    };

    return { userData, alertData, showAlert, placeholderEmail, placeholderPassword, isLoading, sendData, sendView };
  },
};
</script>

<template>
  <div class="login py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto">
      <img src="../assets/logo_complete.png" alt="" width="200" height="200" @click="sendView('/')" />
      <alert v-if="showAlert" :alert-data="alertData"></alert>
      <form @submit.prevent="sendData">
        <h1 class="h3 mb-3 fw-normal">{{ $t("login.title") }}</h1>

        <div class="form-floating">
          <input
            v-model="userData.email"
            type="email"
            class="form-control"
            id="floatingInput"
            :placeholder="placeholderEmail"
            required
          />
          <label for="floatingInput">{{ $t("login.email") }}</label>
        </div>
        <div class="form-floating">
          <input
            v-model="userData.password"
            type="password"
            class="form-control"
            id="floatingPassword"
            :placeholder="placeholderPassword"
            required
          />
          <label for="floatingPassword">{{ $t("login.password") }}</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          {{ $t("login.button.login") }}
        </button>
        <button class="btn btn-outline-secondary w-100 py-2 mt-2" type="button" @click="sendView('/register')">
          {{ $t("login.button.user") }}
        </button>
      </form>
    </main>
    <image-loading v-if="isLoading" />
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_login.scss";
</style>