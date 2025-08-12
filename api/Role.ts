import { IRole } from "@/interface/Role";
import api from "./axios";



export const createRole = (data: IRole, token:string) => api.post('/role', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const getRoles = (token:string) => api.get('/role', {
    headers: { Authorization: `Bearer ${token}` }
  });
export const disableRole = (data:IRole, token:string) => api.put('/role/disable', { id:data.id }, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const updateRole = (data: IRole, token:string) => api.put('/role', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
