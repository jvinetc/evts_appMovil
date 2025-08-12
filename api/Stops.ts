import { StopData } from '@/interface/Stop';
import { UserData } from '@/interface/User';
import api from './axios';

export const byExcel = (data: StopData[], token: string) => api.post('/stop/byExcel', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const pay= (data:StopData[], amount: number, sessionId: string, token: string) => api.post('/stop/pay', { selectedStops:data, amount, sessionId }, {
    headers: { Authorization: `Bearer ${token}` }
});
export const createStop=(data: StopData, token: string) => api.post('/stop', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const listStopByUser=(data: UserData, token: string) =>api.get(`/stop/${data.id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
export const disableStop=(data: StopData, token: string) => api.put('/stop/disable', { id: data.id }, {
    headers: { Authorization: `Bearer ${token}` }
});
export const updateStop=(data: StopData, token: string) => api.put('/stop', data, {
    headers: { Authorization: `Bearer ${token}` }
});