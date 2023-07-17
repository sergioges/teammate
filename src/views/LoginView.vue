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
      };
      if (sessionStorage.getItem("chatgpt-token")) {
        router.push({path: "context"});
      };
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
            router.push({path: "context", query:{newAccess: true}});
          } else {
            router.push("/login");
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

    const sendRegister = () => {
      router.push("/register");
    };

    return { userData, alertData, showAlert, sendData, sendRegister };
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
            required
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
            required
          />
          <label for="floatingPassword">Password</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
        <button class="btn btn-outline-secondary w-100 py-2 mt-2" type="button" @click="sendRegister">
          Have you register yet?
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_login.scss";
</style>