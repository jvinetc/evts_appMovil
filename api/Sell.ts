import { SellData } from "@/interface/Sell";
import { UserData } from "@/interface/User";
import api from "./axios";

export const createSell = (data: SellData, token: string) => 
  api.post('/sell', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const getSellById=(data: UserData, token: string) =>
    api.get(`/sell/${data.id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
export const disableSell=(data: SellData, token: string) => 
    api.put('/sell/disable', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const updateStop=(data: SellData, token: string) => api.put('/ell', data, {
    headers: { Authorization: `Bearer ${token}` }
});