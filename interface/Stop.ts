import { IComuna } from "./Comuna";
import { IRate } from "./Rate";
import { SellData } from "./Sell";

export interface StopData {
    id?: number;
    addresName?: string;
    addres?: string;
    phone?: string;
    notes?: string;
    buyOrder?: string;
    sellId?: number;
    driverId?: number;
    comunaId?: number;
    rateId?: number;
    status?: string;
    fragile?: boolean;
    devolution?: boolean;
    lat?: number;
    lng?: number;
    createAt?: Date;
    updateAt?: Date;
    Comuna?: IComuna;
    Rate?: IRate;
    Sell?: SellData;

}