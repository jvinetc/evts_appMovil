import api from "./axios";

export const getNotification = ({ token, id }: { token: string, id:number }) => api.get(`/notification/byClient/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getNotRead = ({ sellId, token }: { sellId: number, token: string }) => api.get(`/notification/notRead/${sellId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const markToRead = ({ id, token }: { id: number, token: string }) => api.put(`/notification/read/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
})

export const saveExpoToken = ({ userId, expoToken }: { userId: number, expoToken: string }) =>
    api.post('/notification/push-token', { userId, expoToken });
