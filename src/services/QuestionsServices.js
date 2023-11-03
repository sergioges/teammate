import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import router from "@/router/router";
import { defineLandingRoute } from "@/mixin/RouteControl";

const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
};
const userId = sessionStorage.getItem("chatgpt-userId") || "";

// You will get all the questions (inquiries) of a specific user from DDBB
const getUserQuestionsService = async () => {
    try {
        const response = await axios
            .get(`${callBaseUrl()}/questions/${userId}`, { headers });
        return response.data.questions.reverse();
    } catch (error) {
        console.log(error.response.data);
        if (error.response && error.response.data.code == 401) {
            router.push(`${defineLandingRoute()}`);
        }
        error.response.controlError = 'getUserQuestionsService';
        return error.response;
    }
};

// You can update a specific question of the DDBB
const updateUserQuestionService = async (question) => {
    try {
        const response = await axios
            .put(`${callBaseUrl()}/questions/${userId}`, question, { headers })
        return response.data;
    } catch (error) {
        error.response.controlError = 'updateUserQuestionService';
        return error.response;
    }
};

// You can delete a specific question of the DDBB
const deleteUserQuestionService = async (question) => {
    try {
        const response = await axios
            .delete(
                `${callBaseUrl()}/questions/${userId}/${question.question_id}`, { headers })
        return response.data;
    } catch (error) {
        error.response.controlError = 'deleteUserQuestionService';
        return error.response;
    }
};

const improveUserQuestionService = async (question) => {
     try {
        const response = await axios
            .put(`${callBaseUrl()}/questions/improve/${userId}`, question, { headers })
        return response.data;
     } catch (error) {
        error.response.controlError = 'improveUserQuestionService';
        return error.response;
     }
};

export { getUserQuestionsService, updateUserQuestionService, deleteUserQuestionService, improveUserQuestionService }