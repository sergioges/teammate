<script>
import { ref } from "vue";
import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

export default {
  name: "QuestionsLis",
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
      return payload && typeof payload === "array"
    } 
  },
  setup(props, { emit }) {
    // DATA
    const userId = ref(sessionStorage.getItem("chatgpt-userId") || "");
    const editIndex = ref(null);

    // Methods
    const startEdit = (index) => {
      editIndex.value = index;
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
          emit('update:questions', response.data);
          editIndex.value = null;
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    };

    const copyQuestion = (question) => {
      emit("question-copied", question);
    };

    return {
      userId,
      editIndex,
      updateQuestion,
      startEdit,
      cancelEdit,
      copyQuestion,
      deleteQuestion,
    };
  },
};
</script>

<template>
  <div>
    <h2 class="h3 mb-3 fw-normal text-white">Your inquiries</h2>
    <ul v-for="(question, index) in questions" :key="index">
      <li>
        <div v-if="editIndex !== index">
          <span>{{ question.content }}</span>
          <img
            class="icon"
            title="Edit"
            src="../../assets/icons/edit-solid-24.png"
            @click="startEdit(index)"
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
            v-model="question.content"
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