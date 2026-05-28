import { spawn } from 'child_process';
import AppError from '../errors/AppError.js';

export const runFFmpeg = (args) => {
    return new Promise((resolve, reject) => {
        console.log('FFmpeg Executed');

        const ffmpeg = spawn('ffmpeg', args);

        let stdout = '';
        let stderr = '';

        ffmpeg.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        ffmpeg.stderr.on('data', (chunk) => {
            const msg = chunk.toString();
            stderr += msg;
            console.log(`[FFMPEG]: ${msg}`);
        })

        ffmpeg.on('error', (error) => {
            console.error(error);
            return reject(error);
        });

        ffmpeg.on('close', (code) => {
            console.log(`[FFMPEG]: Exited With Code ${code}`);
            if (code !== 0) {
                return reject(new AppError(stderr || 'ffmpeg failed', 500));
            }
            resolve({stdout, stderr}
            );
        });
    });
}