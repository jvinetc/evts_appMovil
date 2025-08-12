import { ImagesData } from "./Images";
import { IRole } from "./Role";
import { SellData } from "./Sell";

export interface UserData {
    id?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    age?: number;
    username?: string;
    state?: string;
    image?: string;
    roleId?: number;
    createAt?: string;
    updateAt?: string;
    verification_token?: string;
    Sells?: SellData[];
    Rol?: IRole;
    Images?: ImagesData[];
}
