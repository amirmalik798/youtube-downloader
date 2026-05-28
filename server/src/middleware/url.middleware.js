import AppError from '../errors/AppError.js';
import { sendStatus } from '../utils/sse.util.js';

const validateURL = (req, res, next) => {
    const { url, clientId } = req.body;

    if (!url) {
        console.log(`validateURL Middleware Stopped ${url}`);
        sendStatus('URL is Required', 'ERROR', clientId);
        return next(new AppError('URL is Required', 400));
    }

    const cleanedURL = url.trim();

    if (!cleanedURL.includes('youtube.com') && !cleanedURL.includes('youtu.be')) {
        console.log(`validateURL Middleware Stopped ${cleanedURL}`);
        sendStatus('Invalid Youtube URL', 'ERROR', clientId);
        return next(new AppError('Invalid Youtube URL', 400));
    }

    req.body.url = cleanedURL;

    next();
};

export default validateURL;