import { IComuna } from "@/interface/Comuna";
import api from "./axios";

export const listComunas = () => api.get('/comuna');
export const setComuna = (data:IComuna[]) => api.post('/comuna', data);