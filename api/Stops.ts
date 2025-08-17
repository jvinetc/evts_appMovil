import { StopData } from '@/interface/Stop';
import { UserData } from '@/interface/User';
import api from './axios';

export const uploadExcel = (data: FormData, token: string, sellId?: number) => api.post(`/stop/uploadExcel/${sellId}`, data, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    }
});
export const pay = (data: StopData[] | null, amount: number, sessionId: string, returnUrl: string, token: string) => api.post('/stop/pay', { selectedStops: data, amount, sessionId, returnUrl }, {
    headers: { Authorization: `Bearer ${token}` }
});
export const createStop = (data: StopData, token: string) => api.post('/stop', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const listStopByUser = (data: UserData, token: string) => api.get(`/stop/${data.Sells?.length !== undefined ? data.Sells[0].id : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const disableStop = (data: StopData, token: string) => api.put('/stop/disable', { id: data.id }, {
    headers: { Authorization: `Bearer ${token}` }
});
export const updateStop = (data: StopData, token: string) => api.put('/stop', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const getPays = (sellId:number, token:string) => api.get(`/stop/pays/${sellId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getPayDetail = (buyOrder?:string, token?:string) => api.get(`/stop/pays/detail/${buyOrder}`, {
    headers: { Authorization: `Bearer ${token}` }
});
export const downloadTemplate = (token: string) => api.get(`/stop/downloadTemplate`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
});