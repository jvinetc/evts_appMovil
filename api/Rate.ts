import { IRate } from "@/interface/Rate";
import api from "./axios";

export const listRates = async (token:string) => {
    return await api.get<IRate[]>('/rate', {
    headers: { Authorization: `Bearer ${token}` }
});
}
