<script>
import { ref } from "vue";
import router from "@/router/router";
import { getFirstImagesService, getNextImagesService } from "@/services/GalleryServices";
import { defineConversationRoute } from "@/mixin/RouteControl";
import Modal from "@/components/library/Modal.vue";
import ShowGallery from "@/components/gallery/ShowGallery.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "GalleryView",
  components: {
    Modal,
    ShowGallery,
  },
  setup() {
    // DATA
    const images = ref([]);
    const selectedImage = ref({});
    const titleImage = ref("");
    const nextPage = ref({ url: "" });
    const query = ref("");
    const modalData = ref({});
    const noImages = ref(false);

    const { t } = useI18n();
    const placeholderInput = t("gallery.input");
    const modalErrorTitle = t("gallery.modal.error.title");
    const modalErrorContent = t("gallery.modal.error.content");

    //METHODS
    const getFirstImages = async () => {
      const serviceData = await getFirstImagesService(query.value);
      if (serviceData.controlError) {
        controlModalError(serviceData);
      } else {
        images.value = serviceData.gallery;
        nextPage.value.url = serviceData.next_page_url;
        if (images.value.length == 0) {
            noImages.value = true;
          } else {
            noImages.value = false;
          }
      }
    };

    const getNextImages = async () => {
      const serviceData = await getNextImagesService(nextPage.value);
      if (serviceData.controlError) {
        controlModalError(serviceData);
      } else {
        images.value.push(...serviceData.gallery);
        nextPage.value.url = serviceData.next_page_url;
      }
    };

    const getImage = (image) => {
      selectedImage.value = image;
      titleImage.value = query.value;
    };

    const backChat = () => {
      router.push(`${defineConversationRoute()}`);
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    const controlModalError = (error) => {
      console.log(error);
      modalData.value = {
        title: modalErrorTitle,
        content: modalErrorContent,
      };
    };

    return {
      images,
      selectedImage,
      titleImage,
      query,
      nextPage,
      modalData,
      noImages,
      placeholderInput,
      getFirstImages,
      getNextImages,
      getImage,
      backChat,
      scrollToTop
    };
  },
};
</script>

<template>
  <div class="gallery bg-body-tertiary">
    <modal :modal-data="modalData"></modal>
    <show-gallery
      :selectedImage="selectedImage"
      :titleImage="titleImage"
    ></show-gallery>

    <section class="navbar">
      <img src="../assets/logo_name.png" alt="" />
      <div class="container-search">
        <form
          @submit.prevent="getFirstImages"
          class="d-flex needs-validation"
          role="search"
        >
          <input
            v-model="query"
            class="input-search form-control me-2"
            type="search"
            :placeholder="placeholderInput"
            aria-label="Search"
            required
          />
          <button class="btn btn-primary" type="submit">{{ $t("gallery.button.search") }}</button>
          <div class="btn btn-primary" @click="backChat()">{{ $t("gallery.button.back") }}</div>
        </form>
      </div>
    </section>

    <div class="grid-gallery" v-if="!noImages">
      <a
        class="grid-gallery__item"
        v-for="(image, index) in images"
        :key="index"
      >
        <img
          class="grid-gallery__image"
          :src="image.image.url"
          @click="getImage(image)"
        />
      </a>
    </div>
    <h2 class="h2 mb-3 fw-normal text-center" v-else>{{ $t("gallery.empty") }}</h2>

    <div class="more-button" v-if="nextPage.url">
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="getNextImages"
      >
      {{ $t("gallery.button.more") }}
      </button>
    </div>
    <div class="white-space" v-else></div>
    <button class="top-scroll-btn" v-if="images.length > 0" @click="scrollToTop">Top</button>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_gallery.scss";
</style>