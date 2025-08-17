import { UserData } from "@/interface/User";
import api from "./axios";

export const uploadImage = (data: FormData, token: string, user: UserData | undefined) => api.post(`/image/user/${user?.id}`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data"
  }
});
