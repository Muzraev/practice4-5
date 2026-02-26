import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const api = {
    getItems: async () => {
        const response = await apiClient.get('/items');
        return response.data;
    },
    getItemById: async (id) => {
        const response = await apiClient.get(`/items/${id}`);
        return response.data;
    },
    createItem: async (item) => {
        const response = await apiClient.post('/items', item);
        return response.data;
    },
    updateItem: async (id, item) => {
        const response = await apiClient.patch(`/items/${id}`, item);
        return response.data;
    },
    deleteItem: async (id) => {
        const response = await apiClient.delete(`/items/${id}`);
        return response.data; // для DELETE с 204 ответ будет пустым
    }
};