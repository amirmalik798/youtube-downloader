import { spawn } from 'child_process';
import AppError from '../errors/AppError.js';
import { sendStatus } from '../utils/sse.util.js';

export const runYtDlp = (args, clientId) => {
    return new Promise((resolve, reject) => {
        // Node asks OS Kernel to Create Child Process
        const ytdlp = spawn('yt-dlp', args);

        // Output Buffers
        // stdout/stderr are Streams
        // Data Arrives Incrementally Over Time
        let stdout = '';
        let stderr = '';

        let destination = "";
        
        ytdlp.stdout.on('data', (chunk) => {
            const msg = chunk.toString();
            
            if (msg.includes('%') && msg.includes('ETA')) {
                const progress = msg.replace('[download] ', '');
                sendStatus(progress, 'DOWNLOADING', clientId);
            }
            
            if (msg.includes('/') || msg.includes('\\')) {
                destination = msg;
            }

            stdout += msg;
        });

        ytdlp.stderr.on('data', (chunk) => {
            const msg = chunk.toString();
            console.log(`[YTDLP]: ${msg}`);
            stderr += msg;
        });

        // Handles Process Creation Failure
        ytdlp.on('error', (error) => {
            console.error(error);
            reject(error);
        });

        ytdlp.on('close', (code) => {
            console.log(`[YTDLP]: Exited With Code ${code}`);
            if (code !== 0) {
                return reject(new AppError(stderr || 'yt-dlp failed', 500));
            }
    
            resolve({
                stdout,
                stderr,
                destination
            });
        });
    });
}