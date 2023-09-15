<script>
import { ref } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

export default {
  name: "QuestionsList",
  props: {
    questions: {
      type: Array,
      required: false,
    },
  },
  emits: {
    "question-copied": (payload) => {
      return payload && typeof payload === "object";
    },
    "update:questions": (payload) => {
      return payload && typeof payload === "array";
    },
  },
  setup(props, { emit }) {
    // DATA
    const userId = ref(sessionStorage.getItem("chatgpt-userId") || "");
    const editIndex = ref(null);
    const questionCapitalized = ref('');

    // Methods
    const startEdit = (index, question) => {
      editIndex.value = index;
      questionCapitalized.value = capitalizeQuestion(question);
    };

    const cancelEdit = () => {
      editIndex.value = null;
    };

    const updateQuestion = (question) => {
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
      };

      axios
        .put(`${callBaseUrl()}/questions/${userId.value}`, question, {
          headers,
        })
        .then((response) => {
          editIndex.value = null;
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    };

    const deleteQuestion = (question) => {
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
      };

      axios
        .delete(
          `${callBaseUrl()}/questions/${userId.value}/${question.question_id}`,
          {
            headers,
          }
        )
        .then((response) => {
          emit("update:questions", response.data);
          editIndex.value = null;
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    };

    const capitalizeQuestion = (question) => {
      const CapitalizeFirstLetter = question.content[0].toUpperCase();
      const allString = question.content.slice(1);
      return CapitalizeFirstLetter + allString;
    };

    const copyQuestion = (question) => {
      const questionCapitalized = capitalizeQuestion(question);
      question.content = questionCapitalized;
      emit("question-copied", question);
    };

    const cutQuestion = (question) => {
      const questionCapitalized = capitalizeQuestion(question);
      if (questionCapitalized.length <= 70) {
        return questionCapitalized;
      } else {
        return questionCapitalized.slice(0, 70) + " " + "...";
      }
    };

    return {
      userId,
      editIndex,
      questionCapitalized,
      updateQuestion,
      startEdit,
      cancelEdit,
      copyQuestion,
      deleteQuestion,
      capitalizeQuestion,
      cutQuestion,
    };
  },
};
</script>

<template>
  <div>
    <h2 class="h3 mb-3 fw-normal text-white">{{ $t("chat.inquiries") }}</h2>
    <ul v-for="(question, index) in questions" :key="index">
      <li>
        <div v-if="editIndex !== index">
          <span>{{ cutQuestion(question) }}</span>
          <img
            class="icon"
            title="Edit"
            src="../../assets/icons/edit-solid-24.png"
            @click="startEdit(index, question)"
          />
          <img
            class="icon"
            title="Copy"
            src="../../assets/icons/copy-alt-solid-24.png"
            @click="copyQuestion(question)"
          />
          <img
            class="icon"
            title="Delete"
            src="../../assets/icons/error-circle-solid-24-white.png"
            @click="deleteQuestion(question)"
          />
        </div>
        <div v-else>
          <input
            style="width: 80%"
            type="text"
            v-model="questionCapitalized"
            label="Press enter to save"
          />
          <img
            class="icon"
            title="Update"
            src="../../assets/icons/save-solid-24.png"
            @click="updateQuestion(question)"
          />
          <img
            class="icon"
            title="Cancel"
            src="../../assets/icons/x-square-solid-24.png"
            @click="cancelEdit()"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "../../styles/scss/components/_questions-list.scss";
</style>