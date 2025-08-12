import api from './axios';

export const detailAddres = 
(placeId: string) => api.get(`/autocomplete/detail/${placeId}`);
export const autocomplete = (textInput: string) => 
    api.post(`/autocomplete/${textInput}`);