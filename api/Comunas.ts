import { IComuna } from "@/interface/Comuna";
import api from "./axios";

export const listComunas = (token:string) => api.get('/comuna', {
    headers: { Authorization: `Bearer ${token}` }
});
export const setComuna = (data:IComuna[], token:string) => api.post('/comuna', data, {
    headers: { Authorization: `Bearer ${token}` }
});