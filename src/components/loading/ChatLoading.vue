<script>
export default {
  name: "ChatLoading",
};
</script>

<template>
  <div class="chat-loading-container">
    <div class="loading-balls">
      <span class="loading-text">{{ $t("thinking") }} </span>
      <div class="balls"></div>
      <div class="balls"></div>
      <div class="balls"></div>
    </div>
  </div>
</template>
