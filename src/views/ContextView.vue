<script>
import ImageLoading from "@/components/loading/ImageLoading.vue";
import Modal from "@/components/library/Modal.vue";
import router from "@/router/router";
import { useRoute } from "vue-router";
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
    const route = useRoute();
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

    // TRANSLATION
    const modalTitle = t("context.modal.title");
    const modalContent01 = t("context.modal.content01");
    const modalContent02 = t("context.modal.content02");
    const modalContent03 = t("context.modal.content03");
    const modalContent04 = t("context.modal.content04");
    const modalErrorTitle = t("context.modal.error.title");
    const modalErrorContent = t("context.modal.error.content");
    const acceptButtonAction = t("context.modal.button.accept");
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
        if (route.query.newAccess) {
          modalData.value = {
            title: modalTitle,
            content: `<p>${modalContent01}</p>
            <ul>
              <li><strong>${modalContent02} - </strong> ${response.data.content}</li>
              <li><strong>${modalContent03} - </strong> ${response.data.background}</li>
            </ul>
            <p>${modalContent04}</p>
          `,
          };
          acceptButton.value = {
            active: true,
            action: acceptButtonAction
          };
          contextDatabase.value = response.data.content;
          imgDatabase.value = response.data.background;
        } else {
          contextKeyword.value = response.data.content;
          imgKeyword.value = response.data.background;
        }
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
      };
      axios
        .post(`${callBaseUrl()}/context/`, context.value, { headers })
        .then((response) => {
          images.value = response.data;
          IsLoading.value = false;
          updateContextAndBackground();
        })
        .catch((error) => {
          if (error.response && error.response.data.code == 401) {
            router.push("/welcome");
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
      placeholderTopic,
      placeholderBackground,
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
          {{ $t("context.choose") }}
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
      <h1 class="h3 mb-3 mt-3 fw-normal">{{ $t("context.title") }}</h1>
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
