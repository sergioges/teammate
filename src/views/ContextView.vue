<script>
import ImageLoading from "@/components/loading/ImageLoading.vue";
import Modal from "@/components/library/Modal.vue";
import router from "@/router/router";
import { useImageStore } from "@/store/backgroundImage";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "ContextView",
  components: {
    ImageLoading,
    Modal,
  },
  setup() {
    onMounted(() => {
      if (!sessionStorage.getItem("chatgpt-token")) {
        router.push("/welcome");
      } else {
        getContextAndBackground();
      }
    });
    // Data
    const { t } = useI18n();
    const contextKeyword = ref("");
    const imgKeyword = ref("");
    const imgUrlDataBase = ref("");
    const images = ref([]);
    const IsLoading = ref(false);
    const modalData = ref({});
    const acceptButton = ref({});
    const context = ref({});
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}` || "",
    };

    // TRANSLATION
    const modalErrorTitle = t("context.modal.error.title");
    const modalErrorContent = t("context.modal.error.content");
    const placeholderTopic = t("context.topic");
    const placeholderBackground = t("context.background");

    // Methods
    const getContextAndBackground = async () => {
      try {
        const response = await axios.get(
          `${callBaseUrl()}/context/saved/${sessionStorage.getItem(
            "chatgpt-userId"
          )}`,
          { headers }
        );
        contextKeyword.value = response.data.content;
        imgKeyword.value = response.data.background;
      } catch (error) {
        console.log(error.response.data);
        if (error.response && error.response.data.code == 401) {
          router.push("/welcome");
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
        url: imgUrlDataBase.value
      };
      axios
        .post(`${callBaseUrl()}/context/`, context.value, { headers })
        .then((response) => {
          images.value = response.data;
          IsLoading.value = false;
        })
        .catch((error) => {
          if (error.response && error.response.data.code == 401) {
            router.push("/welcome");
          }
          controlModalError(error);
        });
    };

    const updateContextAndBackground = (url) => {
      const imageUpdated = {
        ...context.value,
        url
      }
      axios
        .post(
          `${callBaseUrl()}/context/saved/${sessionStorage.getItem(
            "chatgpt-userId"
          )}`,
          imageUpdated,
          { headers }
        )
        .then((response) => {
          router.push("/conversation");
        })
        .catch((error) => {
          if (error.response && error.response.data.code == 401) {
            router.push("/welcome");
          }
          controlModalError(error);
        });
    };

    const controlModalError = (error) => {
      console.log(error.response.data);
      IsLoading.value = false;
      modalData.value = {
        title: modalErrorTitle,
        content: modalErrorContent,
      };
      acceptButton.value = {
        active: false
      };
    };

    const getImage = (imageUrl) => {
      const imageStore = useImageStore();
      imageStore.setCurrentImage(imageUrl);
      updateContextAndBackground(imageUrl);
    };

    return {
      contextKeyword,
      imgKeyword,
      images,
      IsLoading,
      modalData,
      acceptButton,
      placeholderTopic,
      placeholderBackground,
      sendContext,
      getImage,
    };
  },
};
</script>

<template>
  <div class="context d-flex align-items-center bg-body-tertiary">
    <modal
        :modal-data="modalData"
        :accept-button="acceptButton"
      ></modal>
    <main class="form-context w-100 m-auto">
      <div class="gallery">
        <h2 class="h3 mb-3 mt-3 fw-normal" v-if="images.length > 0">
          {{ $t("context.choose") }}
        </h2>
        <div class="image" v-for="(imageData, index) in images" :key="index">
          <img
            :src="imageData.image.url"
            :alt="imageData.image.description"
            @click="getImage(imageData.image.url)"
          />
        </div>
      </div>
      <image-loading v-if="IsLoading" />
      <h1 class="h3 mb-3 mt-3 fw-normal">{{ $t("context.title") }}</h1>
      <p class="description">{{ $t("context.description") }}</p>
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
            :placeholder="placeholderTopic"
          />
          <label for="floatingInput"
            >{{ placeholderTopic }}</label
          >
        </div>
        <div class="form-floating">
          <input
            v-model="imgKeyword"
            type="text"
            class="form-control"
            id="imgKeyword"
            name="imgKeyword"
            :placeholder="placeholderBackground"
          />
          <label for="imgKeyword"
            >{{ placeholderBackground }}</label
          >
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          {{ $t("context.button") }}
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_context.scss";
</style>
