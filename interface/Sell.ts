import { IComuna } from "./Comuna";

export interface SellData{
    id?:number;
    name?: string;
    addres?: string;
    email?: string;
    addresPickup?: string;
    comunaId?: number;
    state?: string;
    userId?: number;
    lat?: number;
    lng?: number;
    createAt?: Date;
    updateAt?: Date;
    Comuna?: IComuna;
}