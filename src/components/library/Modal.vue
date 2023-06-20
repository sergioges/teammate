<script>
import { watch } from "vue";

export default {
  name: "Modal",
  props: {
    modalData: {
      type: Object,
      required: true,
    },
    cancelButton: {
      type: Object,
      required: false,
      default: {
        active: true,
        action: 'Cancel'
      }
    },
    acceptButton: {
      type: Object,
      required: false,
      default: {
        active: false,
        action: 'Accept'
      }
    }
  },
  setup(props, { emit }) {
    watch(
      () => props.modalData,
      (newValue) => {
        const displayModal = document.getElementById("active-modal");
        displayModal.click();
      }
    );

    const modalResponse = (response) => {
      emit("modal-Response", response);
    };

    return { modalResponse };
  },
};
</script>

<template>
  <div>
    <!-- This button is necessary for generate the effect -->
    <button
      type="button"
      id="active-modal"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      style="display: none"
    />
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              {{ modalData.title }}
            </h1>
            <button
              v-if="cancelButton.active"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ modalData.content }}</p>
          </div>
          <div class="modal-footer">
            <button
              v-if="cancelButton.active"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="modalResponse(false)"
            >
              {{ cancelButton.action }}
            </button>
            <button
              v-if="acceptButton.active"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="modalResponse(true)"
            >
              {{ acceptButton.action }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>