import { UserData } from '../interface/User';
import api from './axios';

export const login = (data: UserData) =>
    api.post('/user/login',
        { email: data.email, password: data.password });
export const register = (data: UserData) => 
    api.post('/user/register', data);
export const disable = (data: UserData) => 
    api.put('/user/disable', { id: data.id });
export const update = (data: UserData) => 
    api.put('/', data)