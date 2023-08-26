<script>
export default {
  name: "ImageLoading",
};
</script>

<template>
  <div id="ring-loading-container">
    <div class="ring-loader">
      <div class="ring"></div>
    </div>
    <div class="ring-loading-text">{{ $t("loading") }}</div>
  </div>
</template>