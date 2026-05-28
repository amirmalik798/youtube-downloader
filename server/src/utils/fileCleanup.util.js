import fs from 'fs/promises';

const CLEANUP_TIME = Number(process.env.CLEANUP_TIME) || 600000;

export const scheduleFileCleanup = (filePath) => {
    console.log(`[CLEANUP]: Set for ${filePath}`);

    setTimeout(async() => {
        try {
            await fs.unlink(filePath);
            console.log(`[CLEANUP]: Deleted ${filePath}`);
        } catch(error) {
            console.error(`[CLEANUP ERROR]: ${error.message}`);
        }
    }, CLEANUP_TIME);
}
