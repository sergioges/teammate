<script>
import { ref } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
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

    const updateQuestion = (question) => {
      question.content = questionCapitalized.value;

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
          console.log(error.response.data);
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
          console.log(error.response.data);
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

    const improveQuestion = (question) => {
      question.loadingHandler = true;
      question.errorHandler = false;
      const headers = {
        Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
      };

      const languageDict = {
        es: "spanish",
        en: "english",
        fr: "french"
      }
      const languageSystem = window.navigator.language.substring(0, 2);

      let languageContext;
      if (!languageDict[languageSystem]) {
        languageContext = languageDict.en
      } else {
        languageContext = languageDict[languageSystem]
      }

      question.language = languageContext;
      delete question.role;

      axios
        .put(`${callBaseUrl()}/questions/improve/${userId.value}`, question, {
          headers,
        })
        .then((response) => {
          emit("update:questions", response.data);
          question.loadingHandler = false;
        })
        .catch((error) => {
          console.log(error.response.data);
          question.errorHandler = true;
          question.loadingHandler = false;
        });
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