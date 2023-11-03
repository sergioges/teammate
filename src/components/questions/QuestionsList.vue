<script>
import { ref } from "vue";
import { updateUserQuestionService, deleteUserQuestionService, improveUserQuestionService } from "@/services/QuestionsServices";
import languageSystemHandler from "@/mixin/languageSystem"
import { useI18n } from "vue-i18n";

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
      return payload && typeof payload === "object";
    },
  },
  setup(props, { emit }) {
    // DATA
    const { t } = useI18n();
    const userId = ref(sessionStorage.getItem("chatgpt-userId") || "");
    const editIndex = ref(null);
    const questionCapitalized = ref("");

    // Methods
    const startEdit = (index, question) => {
      editIndex.value = index;
      questionCapitalized.value = capitalizeQuestion(question);
    };

    const cancelEdit = () => {
      editIndex.value = null;
    };

    const updateQuestion = async (question) => {
      question.content = questionCapitalized.value;
      const serviceData = await updateUserQuestionService(question);
      if (serviceData.controlError) {
        console.log(serviceData);
      } else {
        editIndex.value = null;
      }
    };

    const deleteQuestion = async (question) => {
      const serviceData = await deleteUserQuestionService(question);
      if (serviceData.controlError) {
        console.log(serviceData);
      } else {
        emit("update:questions", serviceData);
        editIndex.value = null;
      }
    };

    const improveQuestion = async (question) => {
      question.loadingHandler = true;
      question.errorHandler = false;

      question.language = languageSystemHandler();
      delete question.role;

      const serviceData = await improveUserQuestionService(question);
      if (serviceData.controlError) {
        console.log(serviceData);
        question.errorHandler = true;
        question.loadingHandler = false;
      } else {
        emit("update:questions", serviceData);
        question.loadingHandler = false;
      }
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
      improveQuestion
    };
  },
};
</script>

<template>
  <div>
    <h2 class="h3 mb-3 fw-normal text-white">{{ $t("chat.inquiries") }}</h2>
    <ul>
      <li v-for="(question, index) in questions" :key="index">
        <div v-if="editIndex !== index">
          <span style="cursor: help;" :title="question.content">{{ cutQuestion(question) }}</span>
          <img class="icon" title="Edit" src="../../assets/icons/edit-solid-24.png" @click="startEdit(index, question)" />
          <img class="icon" title="Copy" src="../../assets/icons/copy-alt-solid-24.png" @click="copyQuestion(question)" />
          <img class="icon" title="Delete" src="../../assets/icons/error-circle-solid-24-white.png"
            @click="deleteQuestion(question)" />
          <div v-if="!question.update">
            <span class="improved-tag" @click="improveQuestion(question)">{{ $t("questions.improve") }}</span> 
            <span v-if="question.loadingHandler" id="loader-question"></span>
            <span v-if="question.errorHandler" class="error-message">Prueba de nuevo</span>
          </div>
          <div v-else>
            <span class="updated-tag">{{ $t("questions.updated") }}</span>
          </div>
        </div>
        <div v-else>
          <input style="width: 80%" type="text" v-model="questionCapitalized" label="Press enter to save" />
          <img class="icon" title="Update" src="../../assets/icons/save-solid-24.png" @click="updateQuestion(question)" />
          <img class="icon" title="Cancel" src="../../assets/icons/x-square-solid-24.png" @click="cancelEdit()" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "../../styles/scss/components/_questions-list.scss";
</style>