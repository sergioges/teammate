<script>
import { reactive, ref } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import router from "@/router/router";
import Alert from "@/components/library/Alert.vue";

export default {
  name: "RegisterView",
   components: {
    Alert
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

    // Methods
    const sendData = () => {
      axios
        .post(`${callBaseUrl()}/users/`, userData)
        .then((response) => {
          router.push({path: "login", query:{newUser: true}})
        })
        .catch((error) => {
          alertData.value = {
            definition: 'danger',
            message: error.response.data.detail.message,
          }
          showAlert.value = true;
          setTimeout(() => {
            showAlert.value = false;
          }, 2000)
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
      <alert
        v-if="showAlert"
        :alert-data="alertData"
      ></alert>
      <form @submit.prevent="sendData">
        <h1 class="h3 mb-3 fw-normal">Please Register</h1>
        <div class="form-floating">
          <input
            v-model="userData.name"
            type="text"
            class="form-control"
            id="userName"
            placeholder="Your name"
            required
          />
          <label for="floatingInput">Your name</label>
        </div>
        <div class="form-floating">
          <input
            v-model="userData.email"
            type="email"
            class="form-control"
            id="userEmail"
            placeholder="name@example.com"
            required
          />
          <label for="userEmail">Email address</label>
        </div>
        <div class="form-floating">
          <input
            v-model="userData.password"
            type="password"
            class="form-control"
            id="userPassword"
            placeholder="Password"
            required
          />
          <label for="userPassword">Password</label>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit">
          Register
        </button>
        <div class="mt-3 mb-3 text-body-secondary">
          <router-link class="link-register" to="/login">Are you a user?</router-link>
        </div>
      </form>
    </main>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_register.scss";
</style>