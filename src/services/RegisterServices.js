import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";

const sendNewUserService = async (userData) => {
    try {
        const response = await axios
            .post(`${callBaseUrl()}/user/`, userData)
        return response.data;
    } catch (error) {
        error.response.controlError = 'sendNewUserService';
        return error.response;
    }
};

export { sendNewUserService }