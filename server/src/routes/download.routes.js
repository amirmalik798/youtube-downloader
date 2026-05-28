import express from 'express';
import * as downloadController from '../controllers/download.controller.js';
import validateURL from '../middleware/url.middleware.js';
import { addClient, removeClient } from '../store/sse.store.js';

const router = express.Router();

router.post('/metadata', validateURL, downloadController.getMetadata);

router.post('/downloadAudio', validateURL, downloadController.downloadBestAudio);

router.post('/downloadVideo', validateURL, downloadController.downloadBestVideo);

router.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');

    res.setHeader('Cache-Control', 'no-cache');

    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    const clientId = addClient(res);

    const heartbeat = setInterval(() => {
        res.write(': ping\n\n');
    }, 30000);

    res.write(`data: ${JSON.stringify({
        type: 'CONNECTED',
        clientId
    })}\n\n`);

    req.on('close', () => {
        removeClient(clientId);
        clearInterval(heartbeat);
        res.end();
    });
});


export default router;