import express from 'express';
import cors from 'cors';
import path from 'path';
import downloadRoutes from './routes/download.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import AppError from './errors/AppError.js';
import fs from 'fs/promises';

const app = express();

const downloadsDir = path.resolve(process.env.DOWNLOADS_DIR || 'downloads');

await fs.mkdir(downloadsDir, { recursive: true });

app.use(cors());

app.use(express.json());

app.use('/downloads', express.static(downloadsDir, {
    setHeaders: (res) => {
        res.setHeader('Content-Disposition', 'attachment');
    }
}));

app.use('/api/youtube', downloadRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});

app.get('/api/version', (req, res) => {
    res.json({
        version: '1.0.0'
    });
});

app.use((req, res, next) => {
    next(new AppError('Route Not Found', 404));
});

app.use(errorMiddleware);

export default app;