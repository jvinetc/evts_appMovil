import { IRate } from "@/interface/Rate";
import api from "./axios";

export const listRates = async () => {
    return await api.get<IRate[]>('/rate');
}
