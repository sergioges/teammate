<script>
import ImageLoading from "@/components/loading/ImageLoading.vue";
import Modal from "@/components/library/Modal.vue";
import router from "@/router/router";
import { useRoute } from "vue-router";
import { useImageStore } from "@/store/backgroundImage";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import { ref, computed, onMounted } from "vue";

export default {
  name: "ContextView",
  components: {
    ImageLoading,
    Modal,
  },
  setup() {
    const route = useRoute();
    onMounted(() => {
      if (!sessionStorage.getItem("chatgpt-token")) {
        router.push("/login");
      } else {
        getContextAndBackground();
      }
    });
    // Data
    const contextKeyword = ref("");
    const imgKeyword = ref("");
    const contextDatabase = ref("");
    const imgDatabase = ref("");
    const images = ref([]);
    const IsLoading = ref(false);
    const modalData = ref({});
    const acceptButton = ref({});
    const context = ref({});
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}` || "",
    };

    // Methods
    const getContextAndBackground = async () => {
      try {
        const response = await axios.get(
          `${callBaseUrl()}/context/saved/${sessionStorage.getItem(
            "chatgpt-userId"
          )}`,
          { headers }
        );
        if (route.query.newAccess) {
          modalData.value = {
            title: "Are we continuing with the same topic?",
            content: `<p>In your last visit, you left it as:</p>
            <ul>
              <li><strong>CONTEXT - </strong> ${response.data.content}</li>
              <li><strong>BACKGROUND - </strong> ${response.data.background}</li>
            </ul>
            <p>Do you want to keep it?</p>
          `,
          };
          acceptButton.value = {
            active: true,
            action: "Yes, I do",
          };
          contextDatabase.value = response.data.content;
          imgDatabase.value = response.data.background;
        } else {
          contextKeyword.value = response.data.content;
          imgKeyword.value = response.data.background;
        }
      } catch (error) {
        console.log(error.response.data.detail);
        if (error.response && error.response.data.detail.code == 401) {
          router.push("/login");
        }
      }
    };

    const sendContext = () => {
      images.value = [];
      IsLoading.value = true;
      context.value = {
        role: "system",
        content: contextKeyword.value,
        background: imgKeyword.value,
      };
      axios
        .post(`${callBaseUrl()}/context/`, context.value, { headers })
        .then((response) => {
          images.value = response.data;
          IsLoading.value = false;
          updateContextAndBackground();
        })
        .catch((error) => {
          if (error.response && error.response.data.detail.code == 401) {
            router.push("/login");
          }
          controlModalError(error);
        });
    };

    const updateContextAndBackground = () => {
      axios
        .post(
          `${callBaseUrl()}/context/saved/${sessionStorage.getItem(
            "chatgpt-userId"
          )}`,
          context.value,
          { headers }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.data.detail.code == 401) {
            router.push("/login");
          }
          controlModalError(error);
        });
    };

    const controlModalError = (error) => {
      console.log(error.response.data.detail);
      IsLoading.value = false;
      modalData.value = {
        title: "Something went wrong",
        content: "Sorry for the inconvenience, please try again.",
      };
    };

    const getImage = (image) => {
      const imageStore = useImageStore();
      imageStore.setCurrentImage(image);
      router.push("/conversation");
    };

    const modalResponse = (response) => {
      if (response) {
        contextKeyword.value = contextDatabase.value;
        imgKeyword.value = imgDatabase.value;
      }
    };

    return {
      contextKeyword,
      imgKeyword,
      images,
      IsLoading,
      modalData,
      acceptButton,
      sendContext,
      getImage,
      modalResponse,
    };
  },
};
</script>

<template>
  <div class="context d-flex align-items-center bg-body-tertiary">
    <modal
      :modal-data="modalData"
      :accept-button="acceptButton"
      @modal-response="modalResponse"
    ></modal>
    <main class="form-context w-100 m-auto">
      <div class="gallery">
        <h2 class="h3 mb-3 mt-3 fw-normal" v-if="images.length > 0">
          Choose your background image:
        </h2>
        <div class="image" v-for="(image, index) in images" :key="index">
          <img
            :src="image.image.url"
            :alt="image.image.description"
            @click="getImage(image)"
          />
        </div>
      </div>
      <image-loading v-if="IsLoading" />
      <h1 class="h3 mb-3 mt-3 fw-normal">How Can I Help?</h1>
      <!-- TODO Structure for inject code format -->
      <!-- <pre style="background-color: grey"><code>{{ contextPre }}</code></pre> -->
      <form @submit.prevent="sendContext">
        <div class="form-floating">
          <input
            v-model="contextKeyword"
            type="text"
            class="form-control"
            id="contextKeyword"
            name="contextKeyword"
            placeholder="What do you want to talk about today?"
          />
          <label for="floatingInput"
            >What do you want to talk about today?</label
          >
        </div>
        <div class="form-floating">
          <input
            v-model="imgKeyword"
            type="text"
            class="form-control"
            id="imgKeyword"
            name="imgKeyword"
            placeholder="Tell me what background image you would like to see"
          />
          <label for="imgKeyword"
            >Tell me what background image you would like to see:</label
          >
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          Let's go!
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_context.scss";
</style>
