import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});

server.requestTimeout = 5 * 60 * 1000;
server.keepAliveTimeout = 60 * 1000;
server.headersTimeout = 65 * 1000;
