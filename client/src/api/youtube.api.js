import axios from "axios";

// 5 Minutes Timeout
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 300000
});

export const getMetadata = async (url, clientId) => {
    const response = await api.post('/metadata', {url, clientId});
    return response.data;
}

export const downloadBestAudio = async (url, clientId) => {
    const response = await api.post('/downloadAudio', {url, clientId});
    return response.data.data.downloadURL;
}

export const downloadBestVideo = async (url, clientId) => {
    const response = await api.post('/downloadVideo', {url, clientId});
    return response.data.data.downloadURL;   
}