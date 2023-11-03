import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

const sendDataRegistrationService = async (userData) => {
    try {
        const response = await axios
            .post(`${callBaseUrl()}/register`, userData)
        return response.data;
    } catch (error) {
        error.response.controlError = 'sendDataRegistrationService';
        return error.response;
    }
};

export { sendDataRegistrationService }