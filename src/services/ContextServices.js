import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import router from "@/router/router";
import { defineLandingRoute } from "@/mixin/RouteControl";

const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}` || "",
};
const userId = sessionStorage.getItem("chatgpt-userId") || "";

// You can obtain the context and the background image from DDBB
const getContextAndBackgroundService = async () => {
    try {
        const response = await axios
            .get(`${callBaseUrl()}/context/saved/${userId}`, { headers });
        return response.data;
    } catch (error) {
        console.log(error)
        if (error.response && error.response.data.code == 401) {
            router.push(`${defineLandingRoute()}`);
        }
        error.response.controlError = 'getContextAndBackgroundService';
        return error.response;
    }
};

// You will send a new context and background image to the DDBB
const sendContextService = async (context) => {
    try {
        const response = await axios
            .post(`${callBaseUrl()}/context/`, context, { headers })
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.code == 401) {
            router.push(`${defineLandingRoute()}`);
        }
        error.response.controlError = 'sendContextService';
        return error.response;
    }
};

// You can update the context and the background image to any user
const updateContextAndBackgroundService = async (contextUpdated) => {
    try {
        const response = await axios
            .post(`${callBaseUrl()}/context/saved/${userId}`, contextUpdated, { headers })
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.code == 401) {
            router.push(`${defineLandingRoute()}`);
        }
        error.response.controlError = 'updateContextAndBackgroundService';
        return error.response;
    }
}

export { getContextAndBackgroundService, sendContextService, updateContextAndBackgroundService }