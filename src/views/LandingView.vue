<script>
import { reactive, ref } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import Alert from "@/components/library/Alert.vue";

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

    // METHODS
    const sendData = () => {
      axios
        .post(`${callBaseUrl()}/register`, userData)
        .then((response) => {
          alertData.value = {
            definition: "success",
            message: `Thanks for your registration with the email ${response.data.email}`,
          };
          showAlert.value = true;
          setTimeout(() => {
            showAlert.value = false;
          }, 2000);
          userData.email = "";
        })
        .catch((error) => {
          console.log(error.response.data.detail)
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

    return { userData, showAlert, alertData, sendData };
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
            <h1>Teammate <span>Your Professional Assistant</span></h1>
            <p>
              Teammate, your new professional assistant, taps into the magic of
              <strong>chatGPT's artificial intelligence</strong>. Get ready for
              an all-in-one solution that boosts your productivity and
              efficiency. Say hello to your new trusted companion for all your
              professional needs.
            </p>
            <p class="autor">With chatGPT engine</p>
            <div class="buttons-wrapper">
              <router-link class="button" to="/register">Register</router-link>
              <router-link class="button button-stripe" to="/login"
                >Log In</router-link
              >
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
                <h5>New</h5>
                <p>
                  Embrace the cutting-edge and innovative magic of chatGPT's
                  artificial intelligence, delivering a fresh and modern
                  experience.
                </p>
              </div>
              <div class="promo-column">
                <img
                  src="/icons/landing-professional.png"
                  height="32"
                  width="33"
                  alt=""
                />
                <h5>Professional</h5>
                <p>
                  Rely on a qualified, skilled, and proficient all-in-one
                  solution, fostering productivity and efficiency.
                </p>
              </div>
              <div class="promo-column">
                <img src="/icons/landing-gallery.png" width="30" alt="" />
                <h5>All-in-one</h5>
                <p>
                  Experience a comprehensive and versatile assistant, integrated
                  with high-quality gallery, ensuring complete and unified
                  support.
                </p>
              </div>
              <div class="promo-column">
                <img
                  src="/icons/landing-trusted.png"
                  height="32"
                  width="32"
                  alt=""
                />
                <h5>Trusted</h5>
                <p>
                  With a proven and dependable reputation, chatGPT becomes your
                  reliable and esteemed companion, earning your trust.
                </p>
              </div>
            </div>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.promo clearfix -->
        <div class="discover clearfix">
          <div class="wrap">
            <div class="discover-content clearfix">
              <h2>Discover</h2>
              <p>
                Discover how <strong>chatGPT technology</strong> can be your
                perfect ally to empower your business in generating original and
                personalized ideas and content, all with a simple click.
                Additionally, access a
                <strong>vast number of high-quality images</strong>, ensuring
                your messages reach precisely where you intend with minimal
                effort.
              </p>
              <div class="buttons-discover">
                <router-link class="button" to="/register"
                  >Register</router-link
                >
                <router-link class="button" to="/login">Log In</router-link>
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
                <h4>People talking about <a href="#">#teammate</a></h4>
                <p>
                  Join our #teammate adventure. Discover everything it can do
                  for your business!
                </p>
              </div>
            </div>
          </div>
          <!-- /.wrap -->
        </div>
        <!-- /.comments clearfix -->
        <div class="simple clearfix">
          <div class="wrap">
            <div class="simple-content">
              <h3>The Easiest UI</h3>
              <ul>
                <li class="clearfix">
                  <img
                    src="/icons/landing-easy.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>Easy to use</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-always.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>Always available</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-personal.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>Personal interface</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-image.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>High-quality gallery</span>
                </li>
                <li class="clearfix">
                  <img
                    src="/icons/landing-inquiry.png"
                    height="32"
                    width="32"
                    alt=""
                  /><span>Keep your inquiries</span>
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
            <div class="newsletter-title">Want to know more?</div>
            <div class="alert-container">
              <alert class="alert" v-if="showAlert" :alert-data="alertData"></alert>
            </div>
            <div class="newsletter-form clearfix">
              <form @submit.prevent="sendData">
                <input
                  v-model="userData.email"
                  type="email"
                  placeholder="Write your email"
                  class="input-text"
                  required
                />
                <button class="button" type="submit">
                  Register
                </button>
              </form>
            </div>
            <p>
              If you want to know more about the app and how to get more for
              your business. I will be glad to help.
            </p>
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