<script>
import ConversationMessage from "@/components/messages/ConversationMessage.vue";
import InputMessage from "@/components/messages/InputMessage.vue";
import ChatLoading from "@/components/loading/ChatLoading.vue";
import QuestionsList from "@/components/questions/QuestionsList.vue";
import { useImageStore } from "@/store/backgroundImage";
import { ref, nextTick, computed, onMounted } from "vue";
import router from "@/router/router";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import { useI18n } from "vue-i18n";

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
    const { t } = useI18n();
    const conversation = ref([
      {
        role: "assistant",
        content: t("chat.welcome"),
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

    // COMPUTED
    const contextIcon = computed(() => {
      return t("chat.button.context") === 'Nuevo Contexto' ? 'context-button-trans' : '';
    });
    const logoutIcon = computed(() => {
      return t("chat.button.logout") === 'Cerrar' ? 'logout-button-trans' : '';
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
      router.push("/");
    };

    const sendView = (view) => {
      router.push(view);
    };

    return {
      conversation,
      isLoading,
      userId,
      questions,
      questionCopied,
      contextIcon,
      logoutIcon,
      addUserQuestion,
      addAssistantAnswer,
      chatAutoScroll,
      getUserQuestions,
      addQuestionCopied,
      setLogOut,
      sendView,
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
      <div>
        <div class="logout-button btn btn-primary" :class="logoutIcon" @click="setLogOut()">
          {{ $t("chat.button.logout") }}
        </div>
        <div class="gallery-button btn btn-primary" @click="sendView('/gallery')">
          {{ $t("chat.button.gallery") }}
        </div>
        <div class="context-button btn btn-primary" :class="contextIcon" @click="sendView('/')">
          {{ $t("chat.button.context") }}
        </div>
      </div>
    </div>
    <div class="questions-container">
      <div class="questions-list">
        <questions-list
          :questions="questions"
          @update:questions="questions = $event"
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