<script>
import { ref, watch } from "vue";
import { sendConversationService } from "@/services/ConversationServices";
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
      return payload && typeof payload === "object";
    },
    "answer-generated": (payload) => {
      return payload && typeof payload === "object";
    },
    "error-generated": (payload) => {
      return payload && typeof payload === "string";
    },
  },
  setup(props, { emit }) {
    // Data
    const question = ref({
      role: "user",
      content: "",
      update: null
    });
    const copiedQuestion = ref({});
    const { t } = useI18n();
    const placeholderInfo = ref(t("chat.input"));

    // Methods
    const sendQuestion = async () => {
      const regexJumpLine = /^[\n]+$/;
      let onlyJumpLine = regexJumpLine.test(question.value.content);
      if (!question.value.content || onlyJumpLine) {
        question.value.content = "";
        placeholderInfo.value = t("chat.requiredInput");
      } else {
        emit("question-generated", {
          role: "user",
          content: question.value.content,
          update: question.value.update
        });
        placeholderInfo.value = t("chat.input");
        // Clean input avoiding clean question data
        setTimeout(() => {
          question.value.content = "";
        }, 300);

        const serviceData = await sendConversationService(question.value);
        if (serviceData.controlError) {
          emit("error-generated", serviceData.data);
        } else {
          emit("answer-generated", serviceData);
        }
      }
    };

    // Update the question if it is copied and keep the copied values (content and update) 
    watch(
      () => props.pasteQuestionCopied,
      (newValue) => {
        question.value.content = newValue.content;
        copiedQuestion.value.content = newValue.content;
        copiedQuestion.value.update = newValue.update;
        if (newValue.update != null) question.value.update = newValue.update;
      }
    );

    // Control and keep the update value if the copy/paste question it is modified
    watch(
      () => question.value.content,
      (newValue, oldValue) => {
        if (oldValue != "" && newValue != oldValue) question.value.update = null;
        if (newValue == copiedQuestion.value.content) question.value.update = copiedQuestion.value.update;
      }
    );

    return { question, placeholderInfo, sendQuestion };
  },
};
</script>

<template>
  <div>
    <form @submit.prevent="sendQuestion()" class="text_input input-group">
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
