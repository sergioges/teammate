import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}`,
};
const userId = sessionStorage.getItem("chatgpt-userId") || "";

const sendConversationService = async (question) => {
    try {
        const response = await axios
            .post(`${callBaseUrl()}/conversation/${userId}`, question, {
                headers,
            })
        return response.data
    } catch (error) {
        error.response.controlError = 'sendConversationService';
        return error.response;
    }
};

export { sendConversationService }