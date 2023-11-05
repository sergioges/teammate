<script>
import ConversationMessage from "@/components/messages/ConversationMessage.vue";
import InputMessage from "@/components/messages/InputMessage.vue";
import ChatLoading from "@/components/loading/ChatLoading.vue";
import QuestionsList from "@/components/questions/QuestionsList.vue";
import { useImageStore } from "@/store/backgroundImage";
import { useConversationStore } from "@/store/conversationStore";
import { ref, nextTick, computed, onMounted } from "vue";
import router from "@/router/router";
import { defineLandingRoute } from "@/mixin/RouteControl";
import { getUserQuestionsService } from "@/services/QuestionsServices";
import { useI18n } from "vue-i18n";
import conversation from "@/mocks/conversation";

const MOCK_CONVERSATION = conversation;

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
    const conversationStore = useConversationStore();

    // Data
    const { t } = useI18n();
    const isLoading = ref(false);
    const questions = ref([]);
    const questionCopied = ref({});

    nextTick(() => {
      autoScrollHandler();
      getUserQuestions();
    });

    onMounted(() => {
      if (conversationStore.currentConversation.length === 0) {
          conversationStore.setCurrentConversation({
            role: "assistant",
            content: t("chat.welcome")
        })
      }
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
      conversationStore.setCurrentConversation(question);
      isLoading.value = true;
      autoScrollHandler();
    };

    const addAssistantAnswer = (answer) => {    
      conversationStore.setCurrentConversation(answer); 
      isLoading.value = false;
      getUserQuestions();
    };

    const errorAnswerHandler = (error) => {
      console.log(error);
      isLoading.value = false;
      conversationStore.setCurrentConversation({
        role: "assistant",
        content: t("modal.error.message"),
      });
    };

    const autoScrollHandler = () => {
      const endMessage = document.getElementById("end-message");
      const container = document.querySelector(".chat-messages");
      const scrollOptions = {
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      };
      endMessage.scrollIntoView(scrollOptions);
    };

    const getUserQuestions = async () => {
      const serviceData = await getUserQuestionsService();
      if (serviceData.controlError) {
        console.log(serviceData);
      } else {
        questions.value = serviceData;
        autoScrollHandler();
      }
    };

    const addQuestionCopied = (question) => {
      questionCopied.value = question;
    };

    const setLogOut = () => {
      sessionStorage.removeItem("chatgpt-userId");
      sessionStorage.removeItem("background-image");
      sessionStorage.removeItem("chatgpt-token");
      router.push(`${defineLandingRoute()}`);
    };

    const sendView = (view) => {
      router.push(view);
    };

    return {
      isLoading,
      questions,
      questionCopied,
      contextIcon,
      logoutIcon,
      addUserQuestion,
      addAssistantAnswer,
      errorAnswerHandler,
      getUserQuestions,
      addQuestionCopied,
      setLogOut,
      sendView,
      currentImage: imageStore.currentImage,
      currentConversation: conversationStore.currentConversation
    };
  },
};
</script>

<template>
  <div
    class="app-wrapper"
    :style="{ backgroundImage: 'url(' + currentImage + ')' }"
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
        <div class="context-button btn btn-primary" :class="contextIcon" @click="sendView('/context')">
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
          :conversation="currentConversation"
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
        @error-generated="errorAnswerHandler"
      ></input-message>
    </div>
  </div>
</template>

<style scoped>
@import "../styles/scss/views/_chat.scss";
</style>