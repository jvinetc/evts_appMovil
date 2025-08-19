import api from './axios';

export const detailAddres =
    (placeId: string, token: string) => api.get(`/autocomplete/detail/${placeId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const autocomplete = (textInput: string, token: string) =>
    api.post(`/autocomplete/${textInput}`, {
        headers: { Authorization: `Bearer ${token}` }
    });