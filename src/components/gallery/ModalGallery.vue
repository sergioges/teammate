<script>
import { computed, ref, watch } from "vue";

export default {
  name: "ModalGallery",
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

      var xhr = new XMLHttpRequest();
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

    return { capitalizeTitle, capitalizeDescription, capitalizeAuthor, downloadImage };
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
                <h5 class="card-title">
                  Author: {{ capitalizeAuthor }}
                </h5>
                <p class="card-text">
                  {{ capitalizeDescription }}
                </p>
                <a
                  :href="selectedImage.user.link"
                  target="_blank"
                  class="btn btn-primary"
                  >Visit profile</a
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
            Download
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Modal -->
    <div
      class="modal fade"
      id="card-modal"
      tabindex="-1"
      aria-labelledby="card-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="card" style="width: 18rem">
              <img src="..." class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../styles/scss/components/_modal-gallery.scss";
</style>