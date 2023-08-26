<script>
import { ref, computed } from "vue";

export default {
  name: "ConversationMessage",
  props: {
    conversation: {
      type: Array,
      required: false,
    },
  },
  setup(props) {
    // Data
    const selectedOption = ref("pixel");
    const isVisible = ref(false);
    const copiedIndex = ref(0);

    // Computed
    const avatarUser = computed(() => {
      return `https://xsgames.co/randomusers/avatar.php?g=${selectedOption.value}`;
    });
    const avatarAssistant = computed(() => {
      return "https://xsgames.co/randomusers/avatar.php?g=pixel";
    });

    // Methods
    const getIndexDiv = (index) => {
      return index + 1 === props.conversation.length;
    };

    const copyContent = (content, index) => {
      isVisible.value = true;
      setTimeout(() => {
        isVisible.value = false;
      }, 2000)
      copiedIndex.value = index;
      navigator.clipboard
        .writeText(content)
        .then(() => {
          console.log("Texto copiado al portapapeles: " + content);
        })
        .catch((error) => {
          console.error("Error al copiar al portapapeles:", error);
        });
    };

    const formatMessage = (message) => {
      return message.replace(/\n/g, "<br>");
    };

    return {
      selectedOption,
      avatarUser,
      avatarAssistant,
      isVisible,
      copiedIndex,
      getIndexDiv,
      copyContent,
      formatMessage,
    };
  },
};
</script>

<template>
  <div id="chat-container">
    <div class="radio-container">
      <span>{{ $t("chat.avatar.title") }}:</span>
      <input type="radio" id="female" value="female" v-model="selectedOption" />
      <label for="female">{{ $t("chat.avatar.female") }}</label>

      <input type="radio" id="male" value="male" v-model="selectedOption" />
      <label for="male">{{ $t("chat.avatar.male") }}</label>
    </div>
    <ul v-for="(message, index) in conversation" :key="index">
      <li class="message" :class="message.role === 'user' ? 'right' : 'left'">
        <div
          class="icon-wrapper"
          v-if="message.role === 'assistant' && index != 0"
        >
          <span
            v-if="copiedIndex == index"
            :style="{ visibility: isVisible ? 'visible' : 'hidden' }"
            >{{ $t("chat.copied") }}</span
          >
          <img
            @click="copyContent(message.content, index)"
            title="Copy answer"
            src="../../assets/icons/copy-alt-grey-24.png"
          />
        </div>
        <img
          class="logo"
          :src="message.role === 'user' ? avatarUser : avatarAssistant"
          alt=""
        />
        <p v-html="formatMessage(message.content)"></p>
        <span v-if="getIndexDiv(index)" id="end-message"></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "../../styles/scss/components/_conversation-message.scss";
</style>
