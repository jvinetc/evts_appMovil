import { VerifyResponse } from "@/interface/ApiTransbnak";
import api from "./axios";

export const proccesPay = async (data: VerifyResponse, token: string) => api.post('/payments', data, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getDataPay = async (authorization_code: string | string[], token: string) => api.get(`/payments/${authorization_code}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const verifyPay = async (token_ws: string | null, token: string | null) => api.get(`/payments/verify?token_ws=${token_ws}`, {
    headers: { Authorization: `Bearer ${token}` }
});