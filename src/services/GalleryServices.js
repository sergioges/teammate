import axios from "axios";
import { callBaseUrl } from "@/mixin/BaseUrl";
import router from "@/router/router";

const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("chatgpt-token")}` || "",
};

const getFirstImagesService = async (query) => {
    try {
        const response = await axios
            .get(`${callBaseUrl()}/gallery/${query}`, { headers })
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.code == 401) {
            router.push(`${defineLandingRoute()}`);
        }
        error.response.controlError = 'getFirstImagesService';
        return error.response;
    }
};

const getNextImagesService = async (nextPage) => {
    try {
        const response = await axios
            .post(`${callBaseUrl()}/gallery`, nextPage, { headers })
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.code == 401) {
            router.push(`${defineLandingRoute()}`);
        }
        error.response.controlError = 'getNextImagesService';
        return error.response;
    }
}

export { getFirstImagesService, getNextImagesService }