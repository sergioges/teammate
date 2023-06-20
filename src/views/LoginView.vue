<script>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import router from "@/router/router";
import Alert from "@/components/library/Alert.vue";

// TODO If user already is logged in, avoid to visit the login view

export default {
  name: "LoginView",
  components: {
    Alert,
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
      }
    });

    // Methods
    const sendData = () => {
      axios
        .post(`${callBaseUrl()}/login`, userData)
        .then((response) => {
          const token = response.data.token;
          sessionStorage.setItem("chatgpt-token", token);
          sessionStorage.setItem("chatgpt-userId", response.data.id);
          if (token) {
            router.push("/teammate/context");
          } else {
            router.push("/teammate/login");
          }
        })
        .catch((error) => {
          alertData.value = {
            definition: "danger",
            message: error.response.data.detail.message,
          };
          showAlert.value = true;
          setTimeout(() => {
            showAlert.value = false;
          }, 2000);
        });
    };

    return { userData, alertData, showAlert, sendData };
  },
};
</script>

<template>
  <div class="login py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto">
      <img src="../assets/logo_complete.png" alt="" width="200" height="200" />
      <alert v-if="showAlert" :alert-data="alertData"></alert>
      <form @submit.prevent="sendData">
        <h1 class="h3 mb-3 fw-normal">Please Sign in</h1>

        <div class="form-floating">
          <input
            v-model="userData.email"
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input
            v-model="userData.password"
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label for="floatingPassword">Password</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
        <div class="mt-3 mb-3 text-body-secondary">
          <router-link class="link-register" to="/teammate/register"
            >Have you register yet?</router-link
          >
        </div>
      </form>
    </main>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_login.scss";
</style>