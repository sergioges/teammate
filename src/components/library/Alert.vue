<script>
import { ref, computed } from "vue";

export default {
  name: "Alert",
  props: {
    alertData: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    // DATA
    const icons = {
      danger: 'x-circle-solid-24.png',
      warning: 'error-circle-solid-24.png',
      info: 'info-circle-solid-24',
      success: 'check-circle-solid-24.png'
    }

    // COMPUTED
    const alertStyles = computed(() => {
        if (props.alertData.close) {
            return `alert alert-${props.alertData.definition} alert-dismissible fade show`
        }
      return `alert alert-${props.alertData.definition}`;
    });

    const getIcon = computed(() => {
      return `/icons/${icons[props.alertData.definition]}`
    });

    return { alertStyles, getIcon }
  }
};
</script>

<template>
  <div
    :class="alertStyles"
    role="alert"
  >
    <div class="container">
      <img
        class="icon-style"
        :src="getIcon"
        :alt="[[alertData.definition]]"
      />
      {{ alertData.message }}
      <button v-if="alertData.close" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>
</template>
