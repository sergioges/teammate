<script>
import { ref, watch } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

export default {
  name: "InputMessage",
  props: {
    pasteQuestionCopied: {
      type: Object,
      required: false,
      default: {},
    },
  },
  emits: {
    "question-generated": (payload) => {
      if (payload && typeof payload === "object") {
        return payload.role === "user" && payload.content;
      } else {
        return false;
      }
    },
    "answer-generated": (payload) => {
      return payload && typeof payload === "object";
    },
  },
  setup(props, { emit }) {
    // Data
    const question = ref({
      role: "user",
      content: "",
    });
    const userId = ref(sessionStorage.getItem("chatgpt-userId") || "");
    const placeholderInfo = ref("Write your inquiry and press Enter...");

    // Methods
    const sendQuestion = (id) => {
      if (!question.value.content) {
        placeholderInfo.value = "Please, do not forget to send a query.";
      } else {
        emit("question-generated", {
          role: "user",
          content: question.value.content,
        });
        const headers = {
          Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
        };
        placeholderInfo.value = "Write your inquiry and press Enter...";
        // Clean input avoiding clean question data
        setTimeout(() => {
          question.value.content = "";
        }, 300);

        axios
          .post(`${callBaseUrl()}/conversation/${id}`, question.value, {
            headers,
          })
          .then((response) => {
            emit("answer-generated", response.data);
          })
          .catch((error) => {
            console.log(error.response.data.detail);
          });
      }
    };

    watch(
      () => props.pasteQuestionCopied,
      (newValue) => {
        question.value.content = newValue.content;
      }
    );

    return { userId, question, placeholderInfo, sendQuestion };
  },
};
</script>

<template>
  <input
    type="text"
    class="text_input"
    :placeholder="placeholderInfo"
    v-model="question.content"
    @keyup.enter="sendQuestion(userId)"
  />
</template>

<style scoped>
@import "../../styles/scss/components/_input-message.scss";
</style>
