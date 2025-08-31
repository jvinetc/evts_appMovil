import api from "./axios";

export const getNotification = ({ sellId, token }: { sellId: number, token: string }) => api.get(`/notification/byClient/${sellId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getNotRead = ({ sellId, token }: { sellId: number, token: string }) => api.get(`/notification/notRead/${sellId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const markToRead = ({ id, token }: { id: number, token: string })=>api.put(`/read/${id}`,{}, {
    headers: { Authorization: `Bearer ${token}` }
}) 