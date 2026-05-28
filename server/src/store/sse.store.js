import crypto from 'crypto';

const clientsStore = new Map();

export const addClient = (client) => {
    const clientId = crypto.randomUUID();
    clientsStore.set(clientId, client);
    return clientId;
};

export const removeClient = (clientId) => {
    clientsStore.delete(clientId);
};

export const getClients = () => {
    return clientsStore;
};

export const getClientById = (clientId) => {
    return clientsStore.get(clientId);
}