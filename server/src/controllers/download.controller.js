import * as youtubeService from '../services/youtube.service.js';
import AppError from '../errors/AppError.js';
import { sendStatus } from '../utils/sse.util.js';

export const getMetadata = async (req, res, next) => {
    const { url, clientId } = req.body;

    sendStatus('Fetching Video Metadata...', 'FETCHING', clientId);

    try {
        const metadata = await youtubeService.getMetadata(url);
        sendStatus('Video Metadata Fetched Successfully...', 'READY', clientId);
        return res.status(200).json({
            success: true,
            data: metadata
        });

    } catch(error) {
        sendStatus('Failed to Fetch Metadata.', 'ERROR', clientId);
        return next(new AppError('Error Encountered While Fetching Metadata.', 500));
    }
};

export const downloadBestAudio = async (req, res, next) => {
    
    const { url, clientId } = req.body;
    
    sendStatus('Preparing MP3 for Download...', 'PROCESSING-A', clientId)

    try {
        const { downloadURL } = await youtubeService.downloadBestAudio(url, clientId);
       
        sendStatus('Starting Download...', 'DOWNLOADING', clientId);
        return res.status(200).json({
            success: true,
            data: {
                downloadURL
            }
        });
    } catch(error) {
        sendStatus('Failed to Prepare MP3 for Download.', 'ERROR', clientId); 
        return next(new AppError('Error Encountered While Converting to MP3', 500));
    }
};

export const downloadBestVideo = async (req, res, next) => {
    
    const { url, clientId } = req.body;

    sendStatus('Preparing MP4 for Download...', 'PROCESSING-V', clientId);

    try {
        const { downloadURL } = await youtubeService.downloadBestVideo(url, clientId);

        sendStatus('Starting Download...', 'DOWNLOADING', clientId);
        return res.status(200).json({
            success: true,
            data: {
                downloadURL
            }
        });
    } catch (error) {
        sendStatus('Failed to Prepare MP4 for Download.', 'ERROR', clientId); 
        return next(new AppError('Error Encountered While Downloading MP4', 500));
    }
};