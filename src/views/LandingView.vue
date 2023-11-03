<script>
import { reactive, ref } from "vue";
import { sendDataRegistrationService } from "@/services/LandingServices"
import router from "@/router/router";
import Alert from "@/components/library/Alert.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "LandingVue",
  components: {
    Alert,
  },
  setup() {
    // DATA
    const userData = reactive({
      email: "",
    });
    const alertData = ref({
      definition: "success",
      message: null,
    });
    const showAlert = ref(false);

    const { t } = useI18n();
    const placeholder = t("landing.newsletter.placeholder");
    const modalErrorMessage = t("modal.error.message");

    // METHODS
    const sendData = async () => {
      const serviceData = await sendDataRegistrationService(userData);
      if (serviceData.controlError) {
        console.log(serviceData);
        alertData.value = {
          definition: "danger",
          message: modalErrorMessage,
        };
        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 2000);
      } else {
        alertData.value = {
          definition: "success",
          message: `Thanks for your registration with the email ${serviceData.email}`,
        };
        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 2000);
        userData.email = "";
      }
    };

    const sendView = (view) => {
      router.push(view);
    };

    return { userData, showAlert, alertData, placeholder, sendData, sendView };
  },
};
</script>

<template>
  <div>
    <div class="main">
      <header>
        <div class="wrap">
          <img
            src="/iphone_teammate.png"
            height="532"
            width="252"
            alt=""
            class="header-img"
          />
          <div class="header-wrapper">
            <h1>
              {{ $t("landing.title") }}<span>{{ $t("landing.subtitle") }}</span>
            </h1>
            <p>
              {{ $t("landing.description01") }}
              <strong>{{ $t("landing.chatgpt") }}</strong>
              {{ $t("landing.description02") }}
            </p>
            <p class="autor">{{ $t("landing.author") }}</p>
            <div class="buttons-wrapper">
              <button class="button" @click="sendView('/register')">
                {{ $t("landing.button.register") }}
              </button>
              <button class="button button-stripe" @click="sendView('/login')">
                {{ $t("landing.button.login") }}
              </button>
            </div>
          </div>
          <!-- /.header-wrapper -->
        </div>
        <!-- /.wrap -->
      </header>
      <div class="spanning">
        <div class="promo clearfix">
          <div class="wrap">
            <div class="promo-wrapper clearfix">
              <div class="promo-column">
                <img
                  src="/icons/landing-new.png"
                  height="32"
                  width="24"
                  alt=""
                />
                <h5>{{ $t("landing.promo.new.title") }}</h5>
                <p>{{ $t("landing.promo.new.text") }}</p>
              </div>
              <div class="promo-column">
                <img
                  src="/icons/landing-professional.png"
                  height="32"
                  width="33"
                  alt=""
                />
                <h5>{{ $t("landing.promo.professional.title") }}</h5>
                <p>{{ $t("landing.promo.professional.text") }}</p>
              </div>
              <div class="promo-column">
                <img src="/icons/landing-gallery.png" width="30" alt="" />
                <h5>{{ $t("landing.promo.all.title") }}</h5>
                <p>{{ $t("landing.promo.all.text") }}</p>
              </div>
              <div class="promo-column">
                <img
                  src="/icons/landing-trusted.png"
                  height="32"
                  width="32"
                  alt=""
                />
                <h5>{{ $t("landing.promo.trusted.title") }}</h5>
                <p>{{ $t("landing.promo.trusted.text") }}</p>
              </div>
            </div>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.promo clearfix -->
        <div class="discover clearfix">
          <div class="wrap">
            <div class="discover-content clearfix">
              <h2>{{ $t("landing.discover.title") }}</h2>
              <p>
                {{ $t("landing.discover.text01") }}
                <strong>{{ $t("landing.discover.chatgpt") }}</strong>
                {{ $t("landing.discover.text02") }}
                <strong>{{ $t("landing.discover.images") }}</strong>
                {{ $t("landing.discover.text03") }}
              </p>
              <div class="buttons-discover">
                <button class="button" @click="sendView('/register')">
                  {{ $t("landing.button.register") }}
                </button>
                <button class="button" @click="sendView('/login')">
                  {{ $t("landing.button.login") }}
                </button>
              </div>
            </div>
            <div class="discover-img">
              <div class="discover-img-inside">
                <img src="/logo_readme.png" alt="" />
              </div>
            </div>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.discover clearfix -->
        <div class="comments clearfix">
          <div class="wrap">
            <div class="tab">
              <div class="box visible">
                <h4>{{ $t("landing.comments.title") }} <a href="#">{{ $t("landing.comments.hash") }}</a></h4>
                <p>{{ $t("landing.comments.text") }}</p>
              </div>
            </div>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.comments clearfix -->
        <div class="simple clearfix">
          <div class="wrap">
            <div class="simple-content">
              <h3>{{ $t("landing.simple.title") }}</h3>
              <ul>
                <li class="clearfix">
                  <img
                    src="/icons/landing-easy.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>{{ $t("landing.simple.easy") }}</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-always.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>{{ $t("landing.simple.always") }}</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-personal.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>{{ $t("landing.simple.personal") }}</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-image.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>{{ $t("landing.simple.image") }}</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-inquiry.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>{{ $t("landing.simple.inquiry") }}</span>
                </li>
              </ul>
            </div>
            <div class="simple-img">
              <img src="/landing-team.jpg" height="508" width="587" alt="" />
            </div>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.simple clearfix -->
        <div class="newsletter clearfix">
          <div class="wrap">
            <div class="newsletter-title">{{ $t("landing.newsletter.title") }}</div>
            <div class="alert-container">
              <alert
                class="alert"
                v-if="showAlert"
                :alert-data="alertData"
              ></alert>
            </div>
            <div class="newsletter-form clearfix">
              <form @submit.prevent="sendData">
                <input
                  v-model="userData.email"
                  type="email"
                  :placeholder="placeholder"
                  class="input-text"
                  required
                />
                <button class="button" type="submit">{{ $t("landing.button.register") }}</button>
              </form>
            </div>
            <p>{{ $t("landing.newsletter.description") }}</p>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.newsletter clearfix -->
      </div>
      <!-- /.spanning-columns -->
    </div>
    <!-- /.main -->
    <footer>
      <div class="wrap">
        <p>
          &copy; 2023
          <strong
            ><a href="https://www.linkedin.com/in/sergioges/" target="_blank"
              >Sergio Escobar</a
            ></strong
          >, All Rights Reserved
        </p>
      </div>
      <!-- /.wrap -->
    </footer>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_landing.scss";
</style>