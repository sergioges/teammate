<script>
import { ref, computed } from "vue";

export default {
  name: "ConversationMessage",
  props: {
    conversation: {
      type: Array,
      required: false
    },
  },
  setup(props) {
    // Data
    const selectedOption = ref("pixel");

    // Computed
    const avatarUser = computed(() => {
      return `https://xsgames.co/randomusers/avatar.php?g=${selectedOption.value}`;
    });
    const avatarAssistant = computed(() => {
      return "https://xsgames.co/randomusers/avatar.php?g=pixel";
    });

    // Methods
    const getIndexDiv = (index) => {
      return index + 1 === props.conversation.length
    } 

    return { selectedOption, avatarUser, avatarAssistant, getIndexDiv };
  },
};
</script>

<template>
  <div id="chat-container">
    <div class="radio-container">
      <span>Tu avatar:</span>
      <input type="radio" id="female" value="female" v-model="selectedOption" />
      <label for="female">Mujer</label>

      <input type="radio" id="male" value="male" v-model="selectedOption" />
      <label for="male">Hombre</label>
    </div>
    <ul v-for="(message, index) in conversation" :key="index">
      <li class="message" :class="message.role === 'user' ? 'right' : 'left'">
        <img
          class="logo"
          :src="message.role === 'user' ? avatarUser : avatarAssistant"
          alt=""
        />
        <p class="message-content">{{ message.content }}</p>
        <span v-if="getIndexDiv(index)" id="end-message"></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import '../../styles/scss/components/_conversation-message.scss';
</style>
