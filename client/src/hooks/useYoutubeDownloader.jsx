import { useEffect, useState } from "react";
import { getMetadata,  downloadBestAudio, downloadBestVideo } from "../api/youtube.api.js";

const useYoutubeDownloader = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const [url, setUrl] = useState('');
    const [metadata, setMetadata] = useState(null);

    const [status, setStatus] = useState('IDLE');
    const [statusMsg, setStatusMsg] = useState('');

    const [clientId, setClientId] = useState('');

    useEffect(() => {
        const eventSource = new EventSource(`${BASE_URL}/events`);

        eventSource.onmessage = (event) => {
            const json = JSON.parse(event.data);
           
            if (json.type === 'CONNECTED') {
                setClientId(json.clientId);
            }
            
            if (json.type === 'STATUS') {
                setStatusMsg(json.statusMsg);
                setStatus(json.status);
            }
        }

        return () => {
            eventSource.close();
        }   
    }, []);

    const fetchMetadata = async () => {
        if (!clientId) return;

        setMetadata(null);
        try {    
            const response = await getMetadata(url, clientId);
            setMetadata(response.data);
        } catch(error) {
            console.log(error.response.data.error.message);
        } 
    }

    const triggerDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const startDownload = async (type) => {
        if (!clientId) return;
        try {
            let downloadLink = '';
            if (type === 'audio') {
                downloadLink = await downloadBestAudio(url, clientId);
            } else {
                downloadLink = await downloadBestVideo(url, clientId);
            }
            downloadLink = `${import.meta.env.VITE_API_SERVER}${downloadLink}`;
            triggerDownload(downloadLink);
            setStatus('READY');
        } catch (error) {
            const message =
                error?.response?.data?.error?.message ||
                error?.response?.data?.message || error?.message ||
                'Something went wrong';
            alert(message);
        }
    }

    // DEBOUNCING
    useEffect(() => {
        if (!url.trim()) { 
            return;
        }

        const timer = setTimeout(() => {
            fetchMetadata();
        }, 500);

        return () => clearTimeout(timer);
    }, [url]);

    const handleCancel = () => {
        setMetadata(null);
        setUrl('');
        setStatus('IDLE');
        setStatusMsg('');
    }

    return {
        url,
        setUrl,
        metadata,
        handleCancel,
        status,
        statusMsg,
        startDownload,
        clientId
    };
}

export default useYoutubeDownloader;
