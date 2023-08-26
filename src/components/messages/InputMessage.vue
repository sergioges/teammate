<script>
import { ref, watch } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import { useI18n } from "vue-i18n";

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

    const { t } = useI18n();

    const userId = ref(sessionStorage.getItem("chatgpt-userId") || "");
    const placeholderInfo = ref(t("chat.input"));

    // Methods
    const sendQuestion = (id) => {
      const regexJumpLine = /^[\n]+$/;
      let onlyJumpLine = regexJumpLine.test(question.value.content);
      if (!question.value.content || onlyJumpLine) {
        question.value.content = "";
        placeholderInfo.value = t("chat.requiredInput");
      } else {
        emit("question-generated", {
          role: "user",
          content: question.value.content,
        });
        const headers = {
          Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
        };
        placeholderInfo.value = t("chat.input");
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
  <div>
    <form @submit.prevent="sendQuestion(userId)" class="text_input input-group">
      <textarea
        rows="1"
        type="text"
        class="text_textarea form-control"
        :placeholder="placeholderInfo"
        v-model="question.content"
      />
      <button
        class="send-button btn btn-secondary"
        type="submit"
        id="button-send"
      >
        {{ $t("chat.button.send") }}
      </button>
    </form>
  </div>
</template>

<style scoped>
@import "../../styles/scss/components/_input-message.scss";
</style>
