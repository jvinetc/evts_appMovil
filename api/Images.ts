import api from "./axios";

export const uploadImage = (data: FormData, token:string) => api.post(`/image/user/${data.get('id')}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
