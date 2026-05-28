import path from 'path';
import fs from 'fs';
import { runYtDlp } from '../utils/ytdlp.util.js';
import { generateFileId } from '../utils/fileId.util.js';
import AppError from '../errors/AppError.js';
import { runFFmpeg } from '../utils/ffmpeg.util.js';
import { scheduleFileCleanup } from '../utils/fileCleanup.util.js';
import { sendStatus } from '../utils/sse.util.js';

const DOWNLOADS_DIR = path.resolve(process.env.DOWNLOADS_DIR || 'downloads');

const sanitizeTitle = (title) => {
    return title
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);
};
   
export const getMetadata = async (url, clientId) => {    
    console.log(`getMetadata Service Executed With URL: ${url}`);
    
    const args = ['-J', url, '--js-runtimes', 'node'];

    const { stdout } = await runYtDlp(args);

    // stdout Contains Plain JSON String
    // We Parse It to Get Pure JS Object 
    try {
        const metadata = JSON.parse(stdout);
        return metadata;
    } catch (error) {
        throw new AppError('Failed to Parse Metadata', 500);
    }
};

export const downloadBestAudio = async (url, clientId) => {
    // USING THIS APPROACH SOLVES FILENAME COLLISION PROBLEMS
    const fileId = generateFileId();

    const outputTemplate = path.join(DOWNLOADS_DIR, `${fileId}.%(ext)s`);
    
    const args = ['-f', 'bestaudio', '-o', outputTemplate, url,
         '--js-runtimes', 'node', '--print', 'after_move:filepath' ,
        '--progress', '--newline'];
    
    const [ytdlpOutput, metadata] = await Promise.all([
        runYtDlp(args, clientId), getMetadata(url, clientId)]);

    const webmPath = ytdlpOutput.destination.trim();

    const safeTitle = sanitizeTitle(metadata.fulltitle);

    const mp3Name = `${safeTitle}-${fileId}.mp3`;
    const mp3Path = path.join(DOWNLOADS_DIR, mp3Name);

    sendStatus('Converting to MP3...', 'DOWNLOADING', clientId);
    await runFFmpeg(['-i', webmPath, mp3Path]);
    sendStatus('Converted to Mp3 Successfully...');
    
    scheduleFileCleanup(webmPath);
    scheduleFileCleanup(mp3Path);

    return {
        downloadURL: `/downloads/${encodeURIComponent(mp3Name)}`
    }
};

export const downloadBestVideo = async (url, clientId) => {
    const fileId = generateFileId();

    const tempName = `${fileId}.%(ext)s`;

    const outputTemplate = path.join(DOWNLOADS_DIR, tempName);
    
    const args = ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
        '--merge-output-format', 'mp4', '-o', outputTemplate, url,
         '--js-runtimes', 'node', '--print', 'after_move:filepath' ,
        '--progress', '--newline' ];

    const [ytdlpOutput, metadata] = await Promise.all([
        runYtDlp(args, clientId), getMetadata(url, clientId)]);

    const tempMp4Path = ytdlpOutput.destination.trim();
    
    const safeTitle = sanitizeTitle(metadata.fulltitle);

    const mp4Name = `${safeTitle}-${fileId}.mp4`;
    const mp4Path = path.join(DOWNLOADS_DIR, mp4Name);

    await fs.promises.rename(tempMp4Path, mp4Path);
    
    scheduleFileCleanup(mp4Path);

    return {
        downloadURL: `/downloads/${encodeURIComponent(mp4Name)}`
    }
};