import { getClientById } from '../store/sse.store.js';

export const sendStatus = (statusMsg, status, clientId) => {
    const payload = {
        type: 'STATUS',
        statusMsg,
        status
    };

   const client = getClientById(clientId);
   
   if (client) {
    try {
        client.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch(error) {
        console.error(error);
    }
   }
};