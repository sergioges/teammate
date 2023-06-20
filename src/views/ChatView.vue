<script>
import ConversationMessage from "@/components/messages/ConversationMessage.vue";
import InputMessage from "@/components/messages/InputMessage.vue";
import ChatLoading from "@/components/loading/ChatLoading.vue";
import QuestionsList from "@/components/questions/QuestionsList.vue";
import { useImageStore } from "@/store/backgroundImage";
import { ref, nextTick, onMounted } from "vue";
import router from "@/router/router";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

export default {
  name: "ChatView",
  components: {
    InputMessage,
    ConversationMessage,
    ChatLoading,
    QuestionsList,
  },
  setup() {
    // Store
    const imageStore = useImageStore();

    // Data
    const conversation = ref([
      {
        role: "assistant",
        content: "¡Hola! ¿En qué puedo ayudarte hoy?",
      },
    ]);
    const isLoading = ref(false);
    const userId = ref(sessionStorage.getItem("chatgpt-userId") || "");
    const questions = ref([]);
    const questionCopied = ref({});

    nextTick(() => {
      chatAutoScroll();
      getUserQuestions();
    });

    // Methods
    const addUserQuestion = (question) => {
      conversation.value.push(question);
      isLoading.value = true;
      chatAutoScroll();
    };

    const addAssistantAnswer = (answer) => {
      conversation.value.push(answer);
      isLoading.value = false;
      chatAutoScroll();
      getUserQuestions();
    };

    // TODO Hacer que se  muestre por lo menos las primeras lineas de la conversación con autoscroll
    const chatAutoScroll = () => {
      const container = document.querySelector(".chat-messages");
      const endMessage = document.querySelector("#end-message");
      //container.scrollTop = endMessage.offsetTop - container.offsetTop;
      //container.scrollTop = container.scrollHeight;
      const scrollOptions = {
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      };
      endMessage.scrollIntoView(scrollOptions);
    };

    const getUserQuestions = () => {
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
      };

      axios
        .get(`${callBaseUrl()}/questions/${userId.value}`, { headers })
        .then((response) => {
          questions.value = response.data.questions.reverse();
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    };

    const addQuestionCopied = (question) => {
      questionCopied.value = question;
    };

    const setLogOut = () => {
      sessionStorage.removeItem("chatgpt-userId");
      sessionStorage.removeItem("background-image");
      sessionStorage.removeItem("chatgpt-token");
      router.push("/teammate/login");
    };

    return {
      conversation,
      isLoading,
      userId,
      questions,
      questionCopied,
      addUserQuestion,
      addAssistantAnswer,
      chatAutoScroll,
      getUserQuestions,
      addQuestionCopied,
      setLogOut,
      currentImage: imageStore.currentImage,
    };
  },
};
</script>

<template>
  <div
    class="app-wrapper"
    :style="{ backgroundImage: 'url(' + currentImage.image.url + ')' }"
  >
    <div class="header-container">
      <img src="../assets/logo_name.png" alt="" />
      <div class="header-button btn btn-primary" @click="setLogOut()">
        Log Out
      </div>
    </div>
    <div class="questions-container">
      <div class="questions-list">
        <questions-list
          :questions="questions"
          @question-copied="addQuestionCopied"
        ></questions-list>
      </div>
    </div>
    <div class="chat-container">
      <ul class="chat-messages">
        <conversation-message
          :conversation="conversation"
        ></conversation-message>
      </ul>
      <chat-loading v-if="isLoading" />
    </div>
    <div class="input-container">
      <input-message
        class="chat-input"
        :paste-question-copied="questionCopied"
        @question-generated="addUserQuestion"
        @answer-generated="addAssistantAnswer"
      ></input-message>
    </div>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_chat.scss";
</style>