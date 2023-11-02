<script>
import { computed, ref, watch } from "vue";

export default {
  name: "ShowGallery",
  props: {
    selectedImage: {
      type: Object,
      required: false,
    },
    titleImage: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    watch(
      () => props.selectedImage,
      (newValue) => {
        const displayModal = document.getElementById("active-gallery-modal");
        displayModal.click();
      }
    );

    // COMPUTED
    const capitalizeTitle = computed(() => {
      return (
        props.titleImage.charAt(0).toUpperCase() + props.titleImage.slice(1)
      );
    });
    const capitalizeDescription = computed(() => {
      if (props.selectedImage) {
        return (
          props.selectedImage.image.description.charAt(0).toUpperCase() +
          props.selectedImage.image.description.slice(1)
        );
      }
    });
    const capitalizeAuthor = computed(() => {
      if (props.selectedImage) {
        return (
          props.selectedImage.user.name.charAt(0).toUpperCase() +
          props.selectedImage.user.name.slice(1)
        );
      }
    });

    // METHODS
    const downloadImage = () => {
      const urlImage = props.selectedImage.image.url;
      const startIndex = urlImage.lastIndexOf("/") + 1;
      const endIndex = urlImage.indexOf("?");
      const nameImage = urlImage.substring(startIndex, endIndex);

      const xhr = new XMLHttpRequest();
      xhr.open("GET", urlImage, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (xhr.status === 200) {
          var blob = xhr.response;
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = nameImage;
          link.click();
        }
      };
      xhr.send();
    };

    return {
      capitalizeTitle,
      capitalizeDescription,
      capitalizeAuthor,
      downloadImage,
    };
  },
};
</script>

<template>
  <div>
    <!-- This button is necessary for generate the effect -->
    <button
      type="button"
      id="active-gallery-modal"
      data-bs-toggle="modal"
      data-bs-target="#example-gallery-modal"
      style="display: none"
    />
    <div
      class="modal fade"
      id="example-gallery-modal"
      tabindex="-1"
      aria-labelledby="example-gallery-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="example-gallery-modal-label">
              {{ capitalizeTitle }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body modal-container">
            <img
              class="modal-image"
              v-if="selectedImage.image"
              :src="selectedImage.image.url"
              alt=""
            />
            <div class="card image-card" v-if="selectedImage.image">
              <div class="card-image">
                <img
                  :src="selectedImage.user.profile_image"
                  :alt="capitalizeAuthor"
                />
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ $t("gallery.author") }} {{ capitalizeAuthor }}</h5>
                <p class="card-text">
                  {{ capitalizeDescription }}
                </p>
                <a
                  :href="selectedImage.user.link"
                  target="_blank"
                  class="btn btn-primary"
                  >{{ $t("gallery.button.profile") }}</a
                >
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="downloadImage"
            >
              {{ $t("gallery.button.download") }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ $t("gallery.button.close") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../styles/scss/components/_show-gallery.scss";
</style>